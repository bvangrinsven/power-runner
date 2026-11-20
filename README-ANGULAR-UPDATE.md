# Angular 12 to 17 Migration Guide

This guide covers the Angular 12 -> 17 migration for PowerRunner.

## Prerequisites

- Node.js 18+ installed
- Git repository with no uncommitted changes (or be ready to `git stash` / `git reset`)
- Make a backup or ensure you can `git revert` if something breaks

## Step 1: Install Angular CLI 17

Update package.json versions (already done for Angular packages), then install:

```bash
yarn install
# or
npm install
```

This installs Angular CLI 17 and all Angular 17 packages.

## Step 2: Run the Update Script

Use the provided script or run each command manually:

```bash
bash scripts/angular-update.sh
```

Or run each step individually:

```bash
npx ng update @angular/core@13 @angular/cli@13 --allow-dirty --force
npx ng update @angular/core@14 @angular/cli@14 --allow-dirty --force
npx ng update @angular/core@15 @angular/cli@15 --allow-dirty --force
npx ng update @angular/core@16 @angular/cli@16 --allow-dirty --force
npx ng update @angular/core@17 @angular/cli@17 --allow-dirty --force
npx ng update @angular/material@17 --allow-dirty --force
```

The `--allow-dirty` flag allows running on an uncommitted working tree.
The `--force` flag bypasses dependency checks.

## Step 3: Fix Deprecated API Usage

After the ng update commands complete, fix these breaking changes:

### entryComponents (runner.module.ts)

`entryComponents` is no longer supported with Ivy (Angular 17+). Remove the
`entryComponents` array from `RunnerModule`. MatDialog handles dynamic
compilation automatically:

```diff
  @NgModule({
    imports: [ ... ],
    declarations: [ ... ],
-   entryComponents: [
-     AddProfileDialogComponent,
-     AppUpdateDialogComponent
-   ]
  })
```

### waitForAsync (all spec files)

`waitForAsync` was removed from `@angular/core/testing` in Angular 17.
Replace all occurrences with `fakeAsync` from `zone.js/testing` or use
`async/await` with `fixture.whenStable()`:

```diff
- import { TestBed, waitForAsync } from '@angular/core/testing';
+ import { TestBed, fakeAsync } from '@angular/core/testing';

-   it('should create', waitForAsync(() => {
+   it('should create', fakeAsync(() => {
      expect(component).toBeTruthy();
-   }));
+   }));
```

### TestBed.get() (all spec files)

`TestBed.get()` was removed in Angular 17. Replace with `TestBed.inject()`:

```diff
- const service = TestBed.get(MyService);
+ const service = TestBed.inject(MyService);
```

### test.ts (test environment setup)

The test bootstrapping pattern changed in Angular 17. Update `src/test.ts`:

```typescript
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
```

### debugElement (app.component.spec.ts)

`fixture.debugElement` was replaced by `fixture.nativeElement` in Angular 17:

```diff
- const fixture = TestBed.createComponent(AppComponent).debugElement;
+ const fixture = TestBed.createComponent(AppComponent);
```

### zone.js polyfills

In Angular 17, `zone.js/dist/zone-testing` is no longer needed. Update
`src/test.ts` and `src/polyfills.ts`:

- Remove `import 'zone.js/dist/zone-testing';` from `src/test.ts`
- Keep `import 'zone.js/dist/zone';` in `src/polyfills.ts`

### BrowserAnimationsModule (shared.module.ts)

`BrowserAnimationsModule` should only be imported in the root `AppModule`.
Remove it from `shared.module.ts` to prevent duplicate module errors.

## Step 4: Verify the Build

```bash
npx ng build --configuration production
```

## Step 5: Verify the Tests

```bash
npx ng test --browsers=ChromeHeadless --watch=false
```

## Known Changes Between Angular Versions

| Version | Key Changes |
|---------|-------------|
| Angular 13 | Standalone APIs (opt-in), control flow syntax preview |
| Angular 14 | `OnPush` component changes, `$any()` in templates |
| Angular 15 | zone.js 0.12.x, `requestAnimationFrame` scheduler |
| Angular 16 | `@angular/core` reexports, `provideRouter` |
| Angular 17 | Signals (opt-in), new control flow (`@if`, `@for`, `@switch`) |

## If Something Breaks

To revert all changes made during the update:

```bash
git reset --hard HEAD
```

Then reassess before trying again. Make a backup git branch before running
the update as a precaution:

```bash
git branch backup-before-angular-update
```

## Notes

- Electron dependencies are NOT updated in this phase (handled in Phase 3)
- TSLint configuration is kept for now (ESLint migration in Phase 1)
- Third-party Angular-dependent packages (ngx-markdown, angular-split, etc.)
  may need separate updates if they break after the core migration
