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
