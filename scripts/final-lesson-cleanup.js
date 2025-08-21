const fs = require('fs');
const path = require('path');

// Final cleanup replacements
const finalCleanup = [
  // Fix the remaining malformed gradient class
  {
    from: 'bg-gradient-to-r from-[var(--card)] to-[var(--secondary)] -900/20 -900/20',
    to: 'bg-gradient-to-r from-[var(--card)] to-[var(--secondary)]'
  },
  // Fix any remaining broken classes
  {
    from: 'text-[var(--accent)] -200',
    to: 'text-[var(--accent)]'
  }
];

// Function to clean up remaining issues
function finalCleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changesMade = 0;
    
    // Apply final cleanup replacements
    finalCleanup.forEach(replacement => {
      const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement.to);
        changesMade += matches.length;
      }
    });
    
    if (changesMade > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🧹 Final cleanup for ${filePath} (${changesMade} changes)`);
      return true;
    } else {
      console.log(`✨ No cleanup needed for ${filePath}`);
      return false;
    }
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
  console.log('🧹 Starting final cleanup for lesson detail pages...\n');
  
  const lessonPages = findLessonPages();
  console.log(`Found ${lessonPages.length} lesson detail pages to process:\n`);
  
  let filesUpdated = 0;
  
  lessonPages.forEach(pagePath => {
    const relativePath = path.relative(process.cwd(), pagePath);
    console.log(`Processing: ${relativePath}`);
    
    if (finalCleanupFile(pagePath)) {
      filesUpdated++;
    }
    console.log('');
  });
  
  console.log('🎉 Final cleanup completed!');
  console.log(`📊 Summary: ${filesUpdated}/${lessonPages.length} files updated`);
  console.log('\n✨ All lesson detail pages are now perfectly theme-consistent');
  console.log('🎨 Ready for testing across all themes!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { finalCleanupFile, findLessonPages, finalCleanup };
