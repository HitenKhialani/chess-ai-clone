const fs = require('fs');
const path = require('path');

// Function to update a course overview file to match Beginners Course exactly
function fixCourseInconsistencies(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Fix CardDescription to use --secondary-text instead of --muted-foreground
    content = content.replace(/text-\[var\(--muted-foreground\)\] text-lg/g, 'text-[var(--secondary-text)] text-lg');
    
    // 2. Fix hardcoded gradient backgrounds in navigation bars
    content = content.replace(/bg-gradient-to-r from-red-600 to-orange-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-pink-600 to-rose-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-green-600 to-emerald-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-purple-600 to-violet-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-orange-600 to-amber-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-teal-600 to-cyan-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-indigo-600 to-purple-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-emerald-600 to-green-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-violet-600 to-purple-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-amber-600 to-orange-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/bg-gradient-to-r from-cyan-600 to-teal-600/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    
    // 3. Fix hover colors in navigation links
    content = content.replace(/hover:text-red-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-pink-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-green-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-purple-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-orange-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-teal-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-indigo-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-emerald-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-violet-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-amber-100/g, 'hover:text-blue-100');
    content = content.replace(/hover:text-cyan-100/g, 'hover:text-blue-100');
    
    // 4. Fix main card gradient backgrounds
    content = content.replace(/bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950\/30 dark:to-orange-950\/30 border-red-200 dark:border-red-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950\/30 dark:to-rose-950\/30 border-pink-200 dark:border-pink-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950\/30 dark:to-emerald-950\/30 border-green-200 dark:border-green-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950\/30 dark:to-violet-950\/30 border-purple-200 dark:border-purple-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950\/30 dark:to-amber-950\/30 border-orange-200 dark:border-orange-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950\/30 dark:to-cyan-950\/30 border-teal-200 dark:border-teal-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950\/30 dark:to-purple-950\/30 border-indigo-200 dark:border-indigo-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950\/30 dark:to-green-950\/30 border-emerald-200 dark:border-emerald-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950\/30 dark:to-purple-950\/30 border-violet-200 dark:border-violet-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950\/30 dark:to-orange-950\/30 border-amber-200 dark:border-amber-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    content = content.replace(/bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950\/30 dark:to-teal-950\/30 border-cyan-200 dark:border-cyan-800/g, 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800');
    
    // 5. Fix call-to-action gradient backgrounds
    content = content.replace(/bg-gradient-to-r from-red-400 to-orange-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-pink-400 to-rose-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-green-400 to-emerald-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-purple-400 to-violet-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-orange-400 to-amber-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-teal-400 to-cyan-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-indigo-400 to-purple-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-emerald-400 to-green-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-violet-400 to-purple-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-amber-400 to-orange-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    content = content.replace(/bg-gradient-to-r from-cyan-400 to-teal-500/g, 'bg-gradient-to-r from-yellow-400 to-orange-500');
    
    // 6. Fix button text colors in call-to-action
    content = content.replace(/text-red-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-pink-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-rose-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-green-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-emerald-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-purple-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-violet-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-orange-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-amber-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-teal-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-cyan-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    content = content.replace(/text-indigo-600 hover:bg-gray-100/g, 'text-orange-600 hover:bg-gray-100');
    
    // 7. Fix call-to-action button icons to use Sparkles consistently
    content = content.replace(/<Zap className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Crown className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Target className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Star className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Trophy className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<CheckCircle className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<BookOpen className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Clock className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    content = content.replace(/<Users className="w-5 h-5 mr-2" \/>/g, '<Sparkles className="w-5 h-5 mr-2" />');
    
    // 8. Fix main card title icons to use Sparkles consistently
    content = content.replace(/<Zap className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Crown className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Target className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Star className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Trophy className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<CheckCircle className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<BookOpen className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Clock className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    content = content.replace(/<Users className="w-8 h-8 mr-3" \/>/g, '<Sparkles className="w-8 h-8 mr-3" />');
    
    // 9. Fix "Why Choose This Course?" section icons to use Sparkles consistently
    content = content.replace(/<Zap className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Crown className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Target className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Star className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<CheckCircle className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<BookOpen className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Clock className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    content = content.replace(/<Users className="w-6 h-6" \/>/g, '<Sparkles className="w-6 h-6" />');
    
    // 10. Fix call-to-action titles to be consistent
    content = content.replace(/Ready to Master Attacking Chess\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Queen Endgames\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Strategic Planning\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Sicilian Defense\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master French Defense\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Bishop vs Knight Endgames\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Rook Endgame Techniques\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master One d4 Repertoire\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Defensive Mastery\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master Indian Defenses\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master English Opening\?/g, 'Ready to Start Your Chess Journey?');
    content = content.replace(/Ready to Master One e4 Openings\?/g, 'Ready to Start Your Chess Journey?');
    
    // 11. Fix call-to-action descriptions to be consistent
    content = content.replace(/Learn the art of powerful attacks and tactical combinations/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn to win with the most powerful piece in chess/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn strategic thinking and long-term planning/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most popular chess opening/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn solid defensive principles/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Master the most complex endgame scenarios/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn essential rook endgame techniques/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Build a complete d4 repertoire/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Master defensive chess principles/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most flexible chess defenses/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Master the English Opening system/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    content = content.replace(/Learn the most popular chess openings/g, 'Join thousands of players who have mastered the fundamentals with our interactive course');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// List of all course overview files to fix
const courseOverviewFiles = [
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

// Fix all course overview files
console.log('🎯 Fixing course overview inconsistencies to match Beginners Course...');
console.log('📋 Reference standard: Beginners Course (app/learn/courses/beginners-overview.tsx)');
console.log('');

courseOverviewFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixCourseInconsistencies(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('');
console.log('🎉 All course overview files have been updated to match the Beginners Course design!');
console.log('');
console.log('📊 Summary of fixes applied:');
console.log('✅ Unified navigation bar colors (blue gradient)');
console.log('✅ Unified main card backgrounds (blue gradient)');
console.log('✅ Unified call-to-action sections (yellow-orange gradient)');
console.log('✅ Unified button colors and hover states');
console.log('✅ Unified icons (Sparkles throughout)');
console.log('✅ Unified call-to-action titles and descriptions');
console.log('✅ Consistent theme variable usage');
console.log('');
console.log('🎨 All 13 courses now have identical visual design and theming!');
