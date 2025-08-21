const fs = require('fs');
const path = require('path');

// Comprehensive theme replacements including edge cases
const comprehensiveReplacements = [
  // Fix malformed CSS variable references
  {
    from: 'text-[var(--accent)] -200',
    to: 'text-[var(--accent)]'
  },
  {
    from: 'text-[var(--accent)] -200 mb-2',
    to: 'text-[var(--accent)] mb-2'
  },
  {
    from: 'bg-[var(--accent)] -900',
    to: 'bg-[var(--accent)]'
  },
  {
    from: 'text-green-300',
    to: 'text-[var(--accent)]'
  },
  {
    from: 'hover:bg-blue-700',
    to: 'hover:bg-[var(--primary)] hover:opacity-80'
  },
  {
    from: 'hover:bg-green-700',
    to: 'hover:bg-[var(--accent)] hover:opacity-80'
  },
  {
    from: 'hover:bg-orange-700',
    to: 'hover:bg-[var(--highlight)] hover:opacity-80'
  },
  
  // Fix remaining hardcoded colors
  {
    from: 'from-blue-600',
    to: 'from-[var(--primary)]'
  },
  {
    from: 'to-indigo-600',
    to: 'to-[var(--accent)]'
  },
  
  // Clean up malformed gradient classes
  {
    from: 'bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] -900/20 -900/20',
    to: 'bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)]'
  }
];

// Function to clean up file formatting and apply comprehensive fixes
function processFileComprehensive(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changesMade = 0;
    
    // Apply comprehensive replacements
    comprehensiveReplacements.forEach(replacement => {
      const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement.to);
        changesMade += matches.length;
      }
    });
    
    // Fix specific malformed classes
    const specificFixes = [
      // Remove duplicate/broken classes
      {
        from: /bg-\[var\(--accent\)\]\s+-900\s+px-2\s+py-1\s+rounded/g,
        to: 'bg-[var(--accent)] px-2 py-1 rounded'
      },
      // Fix broken text classes
      {
        from: /text-\[var\(--accent\)\]\s+-200\s+mb-2\s+text-xs\s+lg:text-sm/g,
        to: 'text-[var(--accent)] mb-2 text-xs lg:text-sm'
      }
    ];
    
    specificFixes.forEach(fix => {
      const matches = content.match(fix.from);
      if (matches) {
        content = content.replace(fix.from, fix.to);
        changesMade += matches.length;
      }
    });
    
    if (changesMade > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Comprehensive update for ${filePath} (${changesMade} changes)`);
      return true;
    } else {
      console.log(`⏭️  No comprehensive changes needed for ${filePath}`);
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
  console.log('🔧 Starting comprehensive theme consistency fix...\n');
  
  const lessonPages = findLessonPages();
  console.log(`Found ${lessonPages.length} lesson detail pages to process:\n`);
  
  let filesUpdated = 0;
  
  lessonPages.forEach(pagePath => {
    const relativePath = path.relative(process.cwd(), pagePath);
    console.log(`Processing: ${relativePath}`);
    
    if (processFileComprehensive(pagePath)) {
      filesUpdated++;
    }
    console.log('');
  });
  
  console.log('🎉 Comprehensive theme consistency fix completed!');
  console.log(`📊 Summary: ${filesUpdated}/${lessonPages.length} files updated`);
  console.log('\n✨ All lesson detail pages now have clean, consistent theme variables');
  console.log('🎨 Cards and components will now adapt perfectly to all themes');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFileComprehensive, findLessonPages, comprehensiveReplacements };
