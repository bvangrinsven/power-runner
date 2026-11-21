const { createWindowsInstaller } = require('@electron/windows-installer');

async function createInstaller() {
  const baseDir = process.argv[2] || './release/PowerRunner-win32-x64';
  const outputDirectory = process.argv[3] || './release/installers';

  await createWindowsInstaller({
    appDirectory: baseDir,
    outputDirectory: outputDirectory,
    exe: 'PowerRunner.exe',
    setupExe: 'PowerRunnerSetup.exe',
    setupIcon: undefined,
    noMsi: true
  });
}

createInstaller().catch(err => {
  console.error('Installer failed:', err);
  process.exit(1);
});
