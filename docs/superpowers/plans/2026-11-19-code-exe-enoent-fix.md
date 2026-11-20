# Code.exe ENOENT Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the "spawn Code.exe ENOENT" error by searching known VS Code installation paths instead of relying on system PATH.

**Architecture:** Extract the path-finding logic into a pure, testable utility module. Refactor `NodeScriptService.editAsync()` to use the utility, with a `code` CLI fallback and a graceful error when VS Code is not found.

**Tech Stack:** TypeScript, Node.js `child_process.spawn`, Node.js `fs-extra`, Electron

---

### Task 1: Create the code-editor-resolver utility

**Files:**
- Create: `src/electron/utils/code-editor-resolver.ts`
- Create: `src/electron/utils/code-editor-resolver.spec.ts`

- [ ] **Step 1: Write the utility module**

Create `src/electron/utils/code-editor-resolver.ts`:

```typescript
import * as fs from 'fs-extra';

/**
 * Search for Visual Studio Code executable at known Windows installation paths.
 * Returns the first existing path, or null if not found.
 */
export function findCodeExecutable(): string | null {
  const candidates: string[] = [
    `${process.env.LOCALAPPDATA}\\Programs\\Microsoft VS Code\\Code.exe`,
    `${process.env.ProgramFiles}\\Microsoft VS Code\\Code.exe`,
    `${process.env['ProgramFiles(x86)']}\\Microsoft VS Code\\Code.exe`,
  ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Error message shown when VS Code cannot be located.
 */
export const CODE_NOT_FOUND_ERROR =
  'Visual Studio Code is not installed or not accessible. ' +
  'Install VS Code to use the Edit feature, or add it to your PATH.';
```

- [ ] **Step 2: Write the test file**

Create `src/electron/utils/code-editor-resolver.spec.ts`:

```typescript
import { findCodeExecutable, CODE_NOT_FOUND_ERROR } from './code-editor-resolver';

describe('findCodeExecutable', () => {
  let savedEnv: {
    LOCALAPPDATA: string | undefined;
    ProgramFiles: string | undefined;
    'ProgramFiles(x86)': string | undefined;
  };

  beforeEach(() => {
    savedEnv = {
      LOCALAPPDATA: process.env.LOCALAPPDATA,
      ProgramFiles: process.env.ProgramFiles,
      'ProgramFiles(x86)': process.env['ProgramFiles(x86)'],
    };
  });

  afterEach(() => {
    process.env.LOCALAPPDATA = savedEnv.LOCALAPPDATA;
    process.env.ProgramFiles = savedEnv.ProgramFiles;
    process.env['ProgramFiles(x86)'] = savedEnv['ProgramFiles(x86)'];
  });

  it('should return null when all env vars are undefined', () => {
    delete process.env.LOCALAPPDATA;
    delete process.env.ProgramFiles;
    delete process.env['ProgramFiles(x86)'];
    expect(findCodeExecutable()).toBeNull();
  });

  it('should return null when Code.exe does not exist at known paths', () => {
    process.env.LOCALAPPDATA = 'C:\\nonexistent-local';
    process.env.ProgramFiles = 'C:\\nonexistent-programs';
    process.env['ProgramFiles(x86)'] = 'C:\\nonexistent-programs-x86';
    expect(findCodeExecutable()).toBeNull();
  });

  it('should export a descriptive error constant', () => {
    expect(CODE_NOT_FOUND_ERROR).toContain('Visual Studio Code');
    expect(CODE_NOT_FOUND_ERROR).toContain('PATH');
  });
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm run test`
Expected: All tests pass (the new utility test + existing stub tests)

- [ ] **Step 4: Commit**

```bash
git add src/electron/utils/code-editor-resolver.ts src/electron/utils/code-editor-resolver.spec.ts
git commit -m "feat: add code-editor-resolver utility for VS Code path detection"
```

---

### Task 2: Refactor editAsync in NodeScriptService

**Files:**
- Modify: `src/electron/services/node-script.service.ts`

- [ ] **Step 1: Add the import for the resolver**

After the existing imports (after `import { NodeScriptCacheService } from './node-script-cache.service';`), add:

```typescript
import { findCodeExecutable, CODE_NOT_FOUND_ERROR } from '../utils/code-editor-resolver';
```

- [ ] **Step 2: Replace the editAsync method**

Replace the current `editAsync` method (lines 58-67):

```typescript
public editAsync(script: IScriptFile): Promise<void> {
  const codePath = findCodeExecutable();
  if (codePath) {
    spawn(codePath, [`${script.directory}/${script.name}`], {
      stdio: 'ignore',
      detached: true
    });
    return Promise.resolve();
  }

  // Fallback: try the 'code' CLI command in PATH
  return new Promise<void>((resolve, reject) => {
    const child = spawn('code', [`${script.directory}/${script.name}`], {
      stdio: 'ignore',
      detached: true
    });

    child.on('error', () => {
      reject(new Error(CODE_NOT_FOUND_ERROR));
    });

    child.on('spawn', () => {
      resolve();
    });
  });
}
```

- [ ] **Step 3: Remove the old comment**

Remove the `// TODO GBJ: Make compatible with Linux.` comment that was on the old `cwd` line (line 61 in the original file). The `cwd` option and its comment are both gone with the refactored code.

- [ ] **Step 4: Verify the build compiles**

Run: `tsc -p tsconfig.electron.json --noEmit`
Expected: No TypeScript errors

- [ ] **Step 5: Run tests**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/electron/services/node-script.service.ts
git commit -m "fix: resolve Code.exe ENOENT by searching known install paths"
```

---

### Task 3: Manual Verification

**No code changes.** These steps verify the fix works correctly in practice.

- [ ] **Step 1: Test with VS Code installed at default path**
  1. Build: `npm run build`
  2. Launch: `SET NODE_ENV=dev && electron ./dist/electron/main.js`
  3. Open any script, click **Edit**
  4. Expected: VS Code opens the file without error

- [ ] **Step 2: Test with VS Code uninstalled**
  1. Temporarily rename or remove VS Code from the default path
  2. Open a script, click **Edit**
  3. Expected: Clear error message in the console: "Visual Studio Code is not installed or not accessible..."

- [ ] **Step 3: Test with VS Code only in PATH (via `code` CLI)**
  1. Ensure `code` command works in a regular terminal
  2. Open a script, click **Edit**
  3. Expected: VS Code opens via the `code` CLI fallback

- [ ] **Step 4: Test with VS Code neither installed nor in PATH**
  1. Remove VS Code entirely
  2. Open a script, click **Edit**
  3. Expected: Graceful error message, no crash or unhandled rejection

---

## Self-Review

**1. Spec coverage:** All requirements covered — path cascade (Task 1), 3 locations (Task 1), `code` CLI fallback (Task 2), descriptive error (Task 2), no UI changes (confirmed), removed dead comment (Task 2).

**2. Placeholder scan:** No TBD, TODO, or vague instructions. All code shown explicitly. All file paths exact.

**3. Type consistency:** `findCodeExecutable(): string | null` matches across files. `editAsync(script: IScriptFile): Promise<void>` preserves original signature.

**4. Gap check:** The project's electron service specs are all stubs (Jasmine/Karma TestBed with no real assertions). The new utility module has real tests. Manual verification covers integration. No gaps.

---

Plan complete and saved to `docs/superpowers/plans/2026-11-19-code-exe-enoent-fix.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
