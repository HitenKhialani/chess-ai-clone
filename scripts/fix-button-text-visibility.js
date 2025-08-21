const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx and .ts files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix button text visibility
function fixButtonTextVisibility(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace text-[var(--accent-foreground)] with text-[var(--card-foreground)] in button contexts
    const buttonTextRegex = /(bg-gradient-to-r[^}]*text-\[var\(--accent-foreground\)\][^}]*)/g;
    const newContent = content.replace(buttonTextRegex, (match) => {
      modified = true;
      return match.replace(/text-\[var\(--accent-foreground\)\]/g, 'text-[var(--card-foreground)]')
                  .replace(/font-semibold/g, 'font-bold');
    });
    
    // Also fix standalone text-[var(--accent-foreground)] in button contexts
    const standaloneTextRegex = /(className="[^"]*text-\[var\(--accent-foreground\)\][^"]*")/g;
    const finalContent = newContent.replace(standaloneTextRegex, (match) => {
      modified = true;
      return match.replace(/text-\[var\(--accent-foreground\)\]/g, 'text-[var(--card-foreground)]')
                  .replace(/font-semibold/g, 'font-bold');
    });
    
    if (modified) {
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔧 Fixing button text visibility across all pages...\n');

const appDir = path.join(__dirname, '..', 'app');
const componentsDir = path.join(__dirname, '..', 'components');

let allFiles = [];
allFiles = allFiles.concat(findFiles(appDir));
allFiles = allFiles.concat(findFiles(componentsDir));

let fixedCount = 0;
let totalFiles = allFiles.length;

allFiles.forEach(filePath => {
  if (fixButtonTextVisibility(filePath)) {
    fixedCount++;
  }
});

console.log(`\n🎉 Completed! Fixed ${fixedCount} out of ${totalFiles} files.`);
console.log('\n📝 Summary of changes:');
console.log('  • Replaced text-[var(--accent-foreground)] with text-[var(--card-foreground)]');
console.log('  • Changed font-semibold to font-bold for better visibility');
console.log('  • Applied to buttons with gradient backgrounds');
console.log('\n✨ Button text should now be clearly visible in all themes!'); 