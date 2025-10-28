// Packaging script to create extension zip
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJson = require('../package.json');
const version = packageJson.version;
const zipName = `link-redirector-v${version}.zip`;

// Files and directories to include in the package
const filesToInclude = [
  'manifest.json',
  'service-worker.js',
  'popup/',
  'icons/',
  '_locales/'
];

// Files and directories to exclude
const excludePatterns = [
  'node_modules',
  'tests',
  'scripts',
  'utils',
  '.git',
  '.gitignore',
  '.eslintrc.js',
  'package.json',
  'package-lock.json',
  'README.md',
  'coverage',
  '*.log',
  '*.zip'
];

console.log('Creating extension package...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Build zip file using native zip command (or 7z on Windows)
const rootDir = path.join(__dirname, '..');

try {
  // Check if zip is available (Unix/Mac)
  execSync('which zip > /dev/null 2>&1');
  
  // Build exclude arguments
  const excludeArgs = excludePatterns.flatMap(pattern => ['-x', pattern]);
  
  // Change to root directory and create zip
  process.chdir(rootDir);
  const zipCommand = [
    'zip',
    '-r',
    path.join('dist', zipName),
    ...filesToInclude,
    ...excludeArgs,
    '-q'
  ].join(' ');
  
  execSync(zipCommand);
  console.log(`✓ Package created: dist/${zipName}`);
} catch (error) {
  // Try PowerShell Compress-Archive for Windows
  try {
    const includePaths = filesToInclude.map(f => path.join(rootDir, f));
    const excludePaths = excludePatterns.flatMap(pattern => {
      const fullPath = path.join(rootDir, pattern);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
      return null;
    }).filter(Boolean);
    
    const psCommand = `
      $ErrorActionPreference = 'Stop'
      $dest = Join-Path "${rootDir}" "dist" "${zipName}"
      $files = @(${includePaths.map(p => `"${p}"`).join(', ')})
      Compress-Archive -Path $files -DestinationPath $dest -Force
    `;
    
    execSync(`powershell -Command "${psCommand}"`);
    console.log(`✓ Package created: dist/${zipName}`);
  } catch (psError) {
    console.error('Error creating package. Please install zip utility or use PowerShell.');
    console.error('On Windows, ensure PowerShell is available.');
    console.error('On Unix/Mac, install zip: brew install zip (Mac) or apt-get install zip (Linux)');
    process.exit(1);
  }
}

console.log('\nPackage contents:');
filesToInclude.forEach(file => {
  console.log(`  - ${file}`);
});
console.log(`\nReady for Chrome Web Store upload!`);

