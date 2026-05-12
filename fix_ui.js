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

    // Adjust font weights (black -> bold, bold -> semibold, semibold -> medium)
    // To avoid double replacement, we use placeholder tokens
    content = content.replace(/font-black/g, '__F_SEMIBOLD__');
    content = content.replace(/font-bold/g, '__F_MEDIUM__');
    content = content.replace(/font-semibold/g, '__F_MEDIUM__');
    
    content = content.replace(/__F_SEMIBOLD__/g, 'font-semibold');
    content = content.replace(/__F_MEDIUM__/g, 'font-medium');

    // Reduce overly large text
    content = content.replace(/text-4xl/g, 'text-3xl');
    content = content.replace(/text-3xl/g, 'text-2xl');
    content = content.replace(/text-2xl/g, 'text-xl');

    // Reduce overly large icons
    content = content.replace(/size=\{100\}/g, 'size={64}');
    content = content.replace(/size=\{80\}/g, 'size={56}');
    content = content.replace(/size=\{64\}/g, 'size={48}');
    content = content.replace(/size=\{48\}/g, 'size={32}');
    content = content.replace(/size=\{40\}/g, 'size={28}');
    content = content.replace(/size=\{32\}/g, 'size={24}');
    content = content.replace(/size=\{28\}/g, 'size={22}');
    content = content.replace(/size=\{24\}/g, 'size={20}');
    
    // Exception: small icons stay small, but let's just do the big ones

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filePath}`);
    }
  }
});
