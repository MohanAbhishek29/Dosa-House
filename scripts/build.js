const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const distDir = path.join(__dirname, '../dist');

const exclude = [
    'dist',
    '.git',
    '.vscode',
    'node_modules',
    '.gitignore',
    'package.json',
    'package-lock.json',
    'README.md',
    'scripts/build.js' // Don't copy the build script itself
];

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        const files = fs.readdirSync(src);
        files.forEach(file => {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);

            // Check exclusions
            const relativePath = path.relative(sourceDir, srcPath).replace(/\\/g, '/');
            if (exclude.some(ex => relativePath === ex || relativePath.startsWith(ex + '/'))) {
                return;
            }

            copyRecursive(srcPath, destPath);
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Clean dist folder if it exists
if (fs.existsSync(distDir)) {
    console.log('Cleaning dist folder...');
    fs.rmSync(distDir, { recursive: true, force: true });
}

console.log('Building to dist...');
copyRecursive(sourceDir, distDir);
console.log('Build complete!');
