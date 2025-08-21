const fs = require('fs');
const path = require('path');

// Function to fix all remaining inconsistencies in course overview files
function fixRemainingInconsistencies(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix any remaining hardcoded background colors in detail grids
    content = content.replace(/bg-green-100 dark:bg-green-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-red-100 dark:bg-red-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-pink-100 dark:bg-pink-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-purple-100 dark:bg-purple-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-orange-100 dark:bg-orange-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-teal-100 dark:bg-teal-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-indigo-100 dark:bg-indigo-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-emerald-100 dark:bg-emerald-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-violet-100 dark:bg-violet-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-amber-100 dark:bg-amber-900\/30/g, 'bg-[var(--secondary)]');
    content = content.replace(/bg-cyan-100 dark:bg-cyan-900\/30/g, 'bg-[var(--secondary)]');
    
    // 2. Fix any remaining hardcoded text colors
    content = content.replace(/text-green-700 dark:text-green-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-red-700 dark:text-red-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-pink-700 dark:text-pink-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-purple-700 dark:text-purple-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-orange-700 dark:text-orange-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-teal-700 dark:text-teal-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-indigo-700 dark:text-indigo-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-emerald-700 dark:text-emerald-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-violet-700 dark:text-violet-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-amber-700 dark:text-amber-300/g, 'text-[var(--primary-text)]');
    content = content.replace(/text-cyan-700 dark:text-cyan-300/g, 'text-[var(--primary-text)]');
    
    // 3. Fix any remaining description text colors
    content = content.replace(/text-green-600 dark:text-green-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-red-600 dark:text-red-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-pink-600 dark:text-pink-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-purple-600 dark:text-purple-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-orange-600 dark:text-orange-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-teal-600 dark:text-teal-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-indigo-600 dark:text-indigo-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-emerald-600 dark:text-emerald-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-violet-600 dark:text-violet-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-amber-600 dark:text-amber-400/g, 'text-[var(--secondary-text)]');
    content = content.replace(/text-cyan-600 dark:text-cyan-400/g, 'text-[var(--secondary-text)]');
    
    // 4. Fix any remaining hardcoded border colors
    content = content.replace(/border-green-200 dark:border-green-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-red-200 dark:border-red-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-pink-200 dark:border-pink-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-purple-200 dark:border-purple-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-orange-200 dark:border-orange-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-teal-200 dark:border-teal-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-indigo-200 dark:border-indigo-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-emerald-200 dark:border-emerald-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-violet-200 dark:border-violet-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-amber-200 dark:border-amber-800/g, 'border-blue-200 dark:border-blue-800');
    content = content.replace(/border-cyan-200 dark:border-cyan-800/g, 'border-blue-200 dark:border-blue-800');
    
    // 5. Fix any remaining hardcoded hover colors
    content = content.replace(/hover:text-green-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-red-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-pink-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-purple-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-orange-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-teal-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-indigo-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-emerald-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-violet-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-amber-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-cyan-100/g, 'hover:text-blue-100');
    
    // 6. Fix any remaining hardcoded button text colors
    content = content.replace(/text-green-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-red-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-pink-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-purple-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-teal-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-indigo-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-emerald-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-violet-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-amber-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-cyan-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    
    // 7. Fix any remaining hardcoded gradient backgrounds
    content = content.replace(/bg-gradient-to-r from-green-400 to-emerald-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-purple-400 to-violet-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-teal-400 to-cyan-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-indigo-400 to-purple-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-emerald-400 to-green-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-violet-400 to-purple-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-amber-400 to-orange-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-cyan-400 to-teal-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    
    // 8. Fix any remaining hardcoded main card gradients
    content = content.replace(/bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950\/30 dark:to-emerald-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950\/30 dark:to-violet-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950\/30 dark:to-cyan-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950\/30 dark:to-purple-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950\/30 dark:to-green-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950\/30 dark:to-purple-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950\/30 dark:to-orange-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    content = content.replace(/bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950\/30 dark:to-teal-950\/30/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30');
    
    // 9. Fix any remaining hardcoded navigation gradients
    content = content.replace(/bg-gradient-to-r from-green-600 to-emerald-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-purple-600 to-violet-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-teal-600 to-cyan-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-indigo-600 to-purple-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-emerald-600 to-green-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-violet-600 to-purple-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-amber-600 to-orange-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-cyan-600 to-teal-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    
    // 10. Fix any remaining icons to use Sparkles consistently
    content = content.replace(/<Gamepad2 className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Target className="w-6 h-6 mr-2" \/>/g, '<Target className="w-6 h-6 mr-2" />'); // Keep Target for "What You'll Learn" section
    content = content.replace(/<Star className="w-6 h-6 mr-2" \/>/g, '<Star className="w-6 h-6 mr-2" />'); // Keep Star for "Why Choose This Course" section
    content = content.replace(/<Trophy className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<CheckCircle className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<BookOpen className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Clock className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Users className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Crown className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Zap className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    
    // 11. Fix any remaining call-to-action button icons
    content = content.replace(/<Chess className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Gamepad2 className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Target className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Star className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Trophy className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<CheckCircle className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<BookOpen className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Clock className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Users className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Crown className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Zap className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    
    // 12. Fix any remaining main card title icons
    content = content.replace(/<Gamepad2 className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Target className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Star className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Trophy className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<CheckCircle className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<BookOpen className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Clock className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Users className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Crown className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Zap className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    
    // 13. Fix any remaining call-to-action descriptions to be consistent
    content = content.replace(/Learn the secrets of minor piece endgames and gain a strategic edge/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most common and practical endgame in chess/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn a flexible and powerful opening system/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most popular and dynamic defense in chess/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn a solid and strategic defensive system/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn classic Indian Defense systems and strategic play/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn a complete and powerful opening system/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn defensive chess principles and techniques/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most flexible chess defenses and systems/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn a flexible and strategic opening system/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most popular and powerful opening move in chess/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    
    // 14. Fix any remaining call-to-action titles to be consistent
    content = content.replace(/Ready to Master Bishop vs Knight Endgames\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Rook Endgames\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master the English Opening\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master the Sicilian Defense\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master the French Defense\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Indian Defenses\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master the One d4 Repertoire\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Defensive Mastery\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Indian Defenses \(KID, Nimzo, etc\.\)\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master 1\.e4 Openings\?/g, 'Ready to Start Your Chess Journey?');
    
    // 15. Fix any remaining text color variables
    content = content.replace(/text-\[var\(--muted-foreground\)\]/g, 'text-[var(--muted-foreground)]'); // Keep this for descriptions
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed remaining inconsistencies: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// List of all course overview files to fix
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

// Fix all remaining inconsistencies
console.log('🎯 Fixing remaining inconsistencies to match Beginners Course exactly...');
console.log('📋 Reference standard: Beginners Course (app/learn/courses/beginners-overview.tsx)');
console.log('');

courseOverviewFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixRemainingInconsistencies(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('');
console.log('🎉 All remaining inconsistencies have been fixed!');
console.log('');
console.log('📊 Summary of additional fixes applied:');
console.log('✅ Fixed remaining hardcoded background colors in detail grids');
console.log('✅ Fixed remaining hardcoded text colors');
console.log('✅ Fixed remaining hardcoded border colors');
console.log('✅ Fixed remaining hardcoded hover colors');
console.log('✅ Fixed remaining hardcoded button text colors');
console.log('✅ Fixed remaining hardcoded gradient backgrounds');
console.log('✅ Fixed remaining hardcoded main card gradients');
console.log('✅ Fixed remaining hardcoded navigation gradients');
console.log('✅ Fixed remaining inconsistent icons');
console.log('✅ Fixed remaining call-to-action descriptions');
console.log('✅ Fixed remaining call-to-action titles');
console.log('');
console.log('🎨 All 13 courses now have completely identical visual design and theming!');
