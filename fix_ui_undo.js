import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const frontendSrc = 'd:\\Live-stock\\live-stock-frontend\\src';

walkDir(frontendSrc, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Fix the cascading replacement error for text sizes
    // We want text-xl to be text-2xl, text-2xl to be text-3xl
    // Wait, no. The user wanted things smaller. We made them TOO small because 4xl became xl.
    // Let's restore the original sizes by reverting the cascade, then apply it properly.
    // Actually, we don't know what the original was perfectly.
    // BUT we know that anything that is currently text-xl might have been 2xl, 3xl, or 4xl.
    // Let's rely on git to restore! Wait, is it a git repository?
  }
});
