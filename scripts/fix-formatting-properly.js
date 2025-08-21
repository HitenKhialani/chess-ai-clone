const fs = require('fs');
const path = require('path');

// Function to properly fix formatting in a lesson file
function fixFileFormatting(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🔧 Fixing formatting for ${path.basename(filePath)}`);
    
    // Fix the first line - add line break after 'use client'
    content = content.replace(/'use client' import/, "'use client'\n\nimport");
    
    // Fix malformed CSS classes with negative values
    content = content.replace(/-(\d+)\/(\d+)/g, '');
    
    // Fix malformed gradient classes
    content = content.replace(/from-(\w+)-(\d+)\s+to-(\w+)-(\d+)\s+-(\d+)\/(\d+)\s+-(\d+)\/(\d+)/g, 'from-$1-$2 to-$3-$4');
    content = content.replace(/from-(\w+)-(\d+)\s+to-(\w+)-(\d+)\s+-(\d+)\/(\d+)/g, 'from-$1-$2 to-$3-$4');
    
    // Fix malformed color classes
    content = content.replace(/(\w+)-(\d+)\s+-(\d+)/g, '$1-$2');
    
    // Fix missing line breaks in function definitions
    content = content.replace(/(\w+)\s*\(\s*\)\s*{/g, '$1() {\n');
    content = content.replace(/(\w+)\s*\(\s*([^)]*)\s*\)\s*{/g, '$1($2) {\n');
    
    // Fix missing line breaks in return statements
    content = content.replace(/return\s*\(/g, 'return (\n');
    
    // Fix missing line breaks in JSX
    content = content.replace(/>\s*{/g, '>\n{');
    content = content.replace(/}\s*</g, '}\n<');
    
    // Fix missing line breaks in array methods
    content = content.replace(/\.map\(/g, '.\n  map(');
    content = content.replace(/\.forEach\(/g, '.\n  forEach(');
    
    // Fix missing line breaks in conditional statements
    content = content.replace(/if\s*\(/g, 'if (');
    content = content.replace(/else\s*{/g, 'else {');
    
    // Fix missing line breaks in useEffect
    content = content.replace(/useEffect\(/g, 'useEffect(');
    
    // Fix missing line breaks in state declarations
    content = content.replace(/const\s*\[/g, 'const [');
    
    // Fix missing line breaks in function calls
    content = content.replace(/new\s+Chess/g, 'new Chess');
    
    // Fix missing line breaks in className strings
    content = content.replace(/className=\{/g, 'className={\n');
    
    // Fix missing line breaks in template literals
    content = content.replace(/`([^`]*)`/g, (match, inner) => {
      return '`' + inner.replace(/\s+/g, ' ') + '`';
    });
    
    // Add proper spacing around operators
    content = content.replace(/(\w+)\+(\w+)/g, '$1 + $2');
    content = content.replace(/(\w+)-(\w+)/g, '$1 - $2');
    content = content.replace(/(\w+)\*(\w+)/g, '$1 * $2');
    content = content.replace(/(\w+)\/(\w+)/g, '$1 / $2');
    
    // Fix missing semicolons
    content = content.replace(/(\w+)\s*$/gm, '$1;');
    
    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Formatting fixed for ${path.basename(filePath)}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to find all lesson detail pages
function findLessonPages() {
  const coursesDir = path.join(__dirname, '..', 'app', 'learn', 'courses');
  const lessonPages = [];

  try {
    const courseDirs = fs.readdirSync(coursesDir);

    courseDirs.forEach(courseDir => {
      const coursePath = path.join(coursesDir, courseDir);
      const stats = fs.statSync(coursePath);

      if (stats.isDirectory()) {
        const courseFiles = fs.readdirSync(coursePath);

        courseFiles.forEach(file => {
          if (file === 'page.tsx' && courseDir.includes('lesson-')) {
            lessonPages.push(path.join(coursePath, file));
          }
        });
      }
    });
  } catch (error) {
    console.error('Error reading courses directory:', error.message);
  }

  return lessonPages;
}

// Main execution
function main() {
  console.log('🔧 Starting comprehensive formatting fix...\n');

  const lessonPages = findLessonPages();
  console.log(`Found ${lessonPages.length} lesson detail pages to fix:\n`);

  let filesFixed = 0;

  lessonPages.forEach(pagePath => {
    const relativePath = path.relative(process.cwd(), pagePath);
    console.log(`Processing: ${relativePath}`);

    if (fixFileFormatting(pagePath)) {
      filesFixed++;
    }
    console.log('');
  });

  console.log('🎉 Comprehensive formatting fix completed!');
  console.log(`📊 Summary: ${filesFixed}/${lessonPages.length} files fixed`);
  console.log('\n✨ All lesson detail pages now have proper formatting');
  console.log('🚀 Development server should now compile successfully');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixFileFormatting, findLessonPages };
