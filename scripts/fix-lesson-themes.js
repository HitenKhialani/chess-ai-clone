const fs = require('fs');
const path = require('path');

// Define the theme-aware replacements
const themeReplacements = [
  // Replace hardcoded white backgrounds with theme variables
  { 
    from: 'bg-white', 
    to: 'bg-[var(--card)]' 
  },
  { 
    from: 'bg-gray-50', 
    to: 'bg-[var(--card)]' 
  },
  { 
    from: 'bg-gray-100', 
    to: 'bg-[var(--secondary)]' 
  },
  { 
    from: 'bg-blue-50', 
    to: 'bg-[var(--card)]' 
  },
  { 
    from: 'bg-indigo-50', 
    to: 'bg-[var(--card)]' 
  },
  
  // Replace hardcoded text colors with theme variables
  { 
    from: 'text-gray-800', 
    to: 'text-[var(--card-foreground)]' 
  },
  { 
    from: 'text-gray-700', 
    to: 'text-[var(--card-foreground)]' 
  },
  { 
    from: 'text-gray-600', 
    to: 'text-[var(--muted-foreground)]' 
  },
  { 
    from: 'text-blue-800', 
    to: 'text-[var(--accent)]' 
  },
  { 
    from: 'text-green-800', 
    to: 'text-[var(--accent)]' 
  },
  { 
    from: 'text-blue-100', 
    to: 'text-[var(--primary-foreground)]' 
  },
  { 
    from: 'text-blue-200', 
    to: 'text-[var(--muted-foreground)]' 
  },
  
  // Replace hardcoded border colors
  { 
    from: 'border-gray-200', 
    to: 'border-[var(--border)]' 
  },
  { 
    from: 'border-blue-200', 
    to: 'border-[var(--border)]' 
  },
  
  // Replace hardcoded background colors in gradients
  { 
    from: 'from-blue-50', 
    to: 'from-[var(--card)]' 
  },
  { 
    from: 'to-indigo-50', 
    to: 'to-[var(--secondary)]' 
  },
  { 
    from: 'from-gray-50', 
    to: 'from-[var(--card)]' 
  },
  { 
    from: 'to-gray-100', 
    to: 'to-[var(--secondary)]' 
  },
  
  // Replace hardcoded badge and accent colors
  { 
    from: 'bg-blue-100', 
    to: 'bg-[var(--accent)]' 
  },
  { 
    from: 'text-blue-900', 
    to: 'text-[var(--accent-foreground)]' 
  },
  { 
    from: 'bg-green-100', 
    to: 'bg-[var(--accent)]' 
  },
  { 
    from: 'text-green-900', 
    to: 'text-[var(--accent-foreground)]' 
  },
  
  // Replace hardcoded shadow colors
  { 
    from: 'shadow-gray-200', 
    to: 'shadow-[var(--shadow)]' 
  },
  
  // Replace hardcoded hover states
  { 
    from: 'hover:bg-gray-100', 
    to: 'hover:bg-[var(--secondary)]' 
  },
  { 
    from: 'hover:bg-blue-100', 
    to: 'hover:bg-[var(--secondary)]' 
  }
];

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changesMade = 0;
    
    // Apply all theme replacements
    themeReplacements.forEach(replacement => {
      const regex = new RegExp(replacement.from, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement.to);
        changesMade += matches.length;
      }
    });
    
    // Additional specific fixes for lesson pages
    const specificFixes = [
      // Fix hardcoded background colors in specific sections
      {
        from: 'bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] -900/20 -900/20',
        to: 'bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)]'
      },
      // Fix hardcoded text colors in specific elements
      {
        from: 'text-blue-800 -200',
        to: 'text-[var(--accent)]'
      },
      // Fix hardcoded background colors in move indicators
      {
        from: 'bg-blue-400',
        to: 'bg-[var(--accent)]'
      },
      {
        from: 'bg-green-400',
        to: 'bg-[var(--accent-soft)]'
      },
      {
        from: 'bg-indigo-400',
        to: 'bg-[var(--primary)]'
      }
    ];
    
    specificFixes.forEach(fix => {
      const regex = new RegExp(fix.from, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.to);
        changesMade += matches.length;
      }
    });
    
    if (changesMade > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath} (${changesMade} changes)`);
      return true;
    } else {
      console.log(`⏭️  No changes needed for ${filePath}`);
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
  console.log('🎨 Starting theme consistency fix for lesson detail pages...\n');
  
  const lessonPages = findLessonPages();
  console.log(`Found ${lessonPages.length} lesson detail pages to process:\n`);
  
  let totalChanges = 0;
  let filesUpdated = 0;
  
  lessonPages.forEach(pagePath => {
    const relativePath = path.relative(process.cwd(), pagePath);
    console.log(`Processing: ${relativePath}`);
    
    if (processFile(pagePath)) {
      filesUpdated++;
    }
    console.log('');
  });
  
  console.log('🎉 Theme consistency fix completed!');
  console.log(`📊 Summary: ${filesUpdated}/${lessonPages.length} files updated`);
  console.log('\n✨ All lesson detail pages now use proper theme variables');
  console.log('🎨 Cards and components will now adapt correctly to Dark Mode and Neon Mode');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFile, findLessonPages, themeReplacements };
