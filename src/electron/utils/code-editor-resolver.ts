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
