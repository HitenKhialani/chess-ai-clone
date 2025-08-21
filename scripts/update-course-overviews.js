const fs = require('fs');
const path = require('path');

// Function to update a course overview file
function updateCourseOverview(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded text colors with CSS variables
    content = content.replace(/text-\[var\(--secondary-text\)\]/g, 'text-[var(--muted-foreground)]');
    
    // Replace hardcoded background colors with CSS variables where appropriate
    content = content.replace(/bg-white dark:bg-gray-800/g, 'bg-[var(--card)]');
    
    // Replace hardcoded text colors with theme-aware colors
    content = content.replace(/text-blue-700 dark:text-blue-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-red-700 dark:text-red-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-pink-700 dark:text-pink-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-green-700 dark:text-green-300/g, 'text-[var(--accent)]');
    content = content.replace(/text-purple-700 dark:text-purple-300/g, 'text-[var(--accent)]');
    
    // Replace hardcoded description colors
    content = content.replace(/text-blue-600 dark:text-blue-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-red-600 dark:text-red-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-pink-600 dark:text-pink-400/g, 'text-[var(--secondary-text)]');
    
    // Replace hardcoded background colors in detail grids
    content = content.replace(/bg-blue-100 dark:bg-blue-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-red-100 dark:bg-red-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-pink-100 dark:bg-pink-900\/30/g, 'bg-[var(--secondary)]');
    
    // Replace hardcoded badge colors
    content = content.replace(/bg-blue-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    content = content.replace(/bg-red-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    content = content.replace(/bg-pink-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    
    // Replace hardcoded icon background colors
    content = content.replace(/bg-green-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    content = content.replace(/bg-purple-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    
    // Replace hardcoded feature card backgrounds
    content = content.replace(/bg-purple-50 dark:bg-purple-900\/20/g, 'bg-[var(--secondary)]');
    
    // NEW: Replace navigation bar hardcoded colors
    content = content.replace(/bg-gradient-to-r from-blue-600 to-indigo-600 text-white/g, 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] text-[var(--accent-foreground)]');
    content = content.replace(/text-white hover:text-blue-100/g, 'text-[var(--accent-foreground)] hover:text-[var(--accent-foreground)]/80');
    
    // NEW: Replace card background hardcoded colors
    content = content.replace(/bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950\/30 dark:to-indigo-950\/30 border-blue-200 dark:border-blue-800/g, 'bg-[var(--card)] border-[var(--border)]');
    
    // NEW: Replace call-to-action section hardcoded colors
    content = content.replace(/bg-gradient-to-r from-yellow-400 to-orange-500/g, 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]');
    content = content.replace(/text-white mb-4/g, 'text-[var(--accent-foreground)] mb-4');
    content = content.replace(/text-white\/90 mb-6/g, 'text-[var(--accent-foreground)]/90 mb-6');
    content = content.replace(/bg-white text-orange-600 hover:bg-gray-100/g, 'bg-[var(--accent-foreground)] text-[var(--accent)] hover:bg-[var(--accent-foreground)]/90');
    
    // NEW: Replace any remaining hardcoded badge colors
    content = content.replace(/bg-indigo-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    
    // NEW: Replace emerald and teal color variations
    content = content.replace(/bg-emerald-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    content = content.replace(/bg-teal-500 text-white/g, 'bg-[var(--accent)] text-[var(--accent-foreground)]');
    content = content.replace(/from-emerald-600 to-teal-600 text-white/g, 'from-[var(--accent)] to-[var(--accent-soft)] text-[var(--accent-foreground)]');
    
    // NEW: Replace any remaining text-white instances
    content = content.replace(/text-white/g, 'text-[var(--accent-foreground)]');
    
    // NEW: Replace any remaining hover:text-blue-100 instances
    content = content.replace(/hover:text-blue-100/g, 'hover:text-[var(--accent-foreground)]/80');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// List of course overview files to update
const courseOverviewFiles = [
  'app/learn/courses/beginners-overview.tsx',
  'app/learn/courses/attacking-chess-overview.tsx',
  'app/learn/courses/queen-endgames-overview.tsx',
  'app/learn/courses/strategic-planning-overview.tsx',
  'app/learn/courses/sicilian-defense-mastery-overview.tsx',
  'app/learn/courses/french-defense-essentials-overview.tsx',
  'app/learn/courses/bishop-vs-knight-endgames-overview.tsx',
  'app/learn/courses/rook-endgame-techniques-overview.tsx',
  'app/learn/courses/one-d4-repertoire-overview.tsx',
  'app/learn/courses/defensive-mastery-overview.tsx',
  'app/learn/courses/indian-defenses-overview.tsx',
  'app/learn/courses/english-opening-overview.tsx',
  'app/learn/courses/one-e4-openings-explained-overview.tsx'
];

// Update all course overview files
console.log('Updating course overview files to use CSS variables...');
courseOverviewFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    updateCourseOverview(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Course overview files updated successfully!');
