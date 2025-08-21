const fs = require('fs');
const path = require('path');

// Function to update a file with theme-aware colors
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace hardcoded text colors
    const textReplacements = [
      { from: 'text-white', to: 'text-[var(--accent-foreground)]' },
      { from: 'text-gray-800', to: 'text-[var(--card-foreground)]' },
      { from: 'text-gray-700', to: 'text-[var(--card-foreground)]' },
      { from: 'text-gray-600', to: 'text-[var(--muted-foreground)]' },
      { from: 'text-gray-400', to: 'text-[var(--muted-foreground)]' },
      { from: 'text-gray-300', to: 'text-[var(--muted-foreground)]' },
      { from: 'text-slate-300', to: 'text-[var(--muted-foreground)]' },
      { from: 'text-slate-400', to: 'text-[var(--muted-foreground)]' },
      { from: 'text-blue-600', to: 'text-[var(--primary)]' },
      { from: 'text-blue-700', to: 'text-[var(--primary)]' },
      { from: 'text-green-600', to: 'text-[var(--accent)]' },
      { from: 'text-green-700', to: 'text-[var(--accent)]' },
      { from: 'text-red-600', to: 'text-[var(--destructive)]' },
      { from: 'text-red-700', to: 'text-[var(--destructive)]' },
      { from: 'text-purple-600', to: 'text-[var(--accent)]' },
      { from: 'text-purple-700', to: 'text-[var(--accent)]' },
      { from: 'text-orange-600', to: 'text-[var(--primary)]' },
      { from: 'text-orange-700', to: 'text-[var(--primary)]' },
      { from: 'text-teal-600', to: 'text-[var(--accent)]' },
      { from: 'text-teal-700', to: 'text-[var(--accent)]' },
      { from: 'text-indigo-600', to: 'text-[var(--accent)]' },
      { from: 'text-indigo-700', to: 'text-[var(--accent)]' },
      { from: 'text-emerald-600', to: 'text-[var(--accent)]' },
      { from: 'text-emerald-700', to: 'text-[var(--accent)]' },
      { from: 'text-violet-600', to: 'text-[var(--accent)]' },
      { from: 'text-violet-700', to: 'text-[var(--accent)]' },
      { from: 'text-amber-600', to: 'text-[var(--primary)]' },
      { from: 'text-amber-700', to: 'text-[var(--primary)]' },
      { from: 'text-cyan-600', to: 'text-[var(--accent)]' },
      { from: 'text-cyan-700', to: 'text-[var(--accent)]' },
      { from: 'text-pink-600', to: 'text-[var(--accent)]' },
      { from: 'text-pink-700', to: 'text-[var(--accent)]' },
      { from: 'text-rose-600', to: 'text-[var(--accent)]' },
      { from: 'text-rose-700', to: 'text-[var(--accent)]' }
    ];

    // Replace hardcoded background colors
    const bgReplacements = [
      { from: 'bg-white', to: 'bg-[var(--card)]' },
      { from: 'bg-gray-50', to: 'bg-[var(--card)]' },
      { from: 'bg-gray-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-gray-700', to: 'bg-[var(--secondary)]' },
      { from: 'bg-gray-800', to: 'bg-[var(--card)]' },
      { from: 'bg-gray-900', to: 'bg-[var(--background)]' },
      { from: 'bg-slate-50', to: 'bg-[var(--card)]' },
      { from: 'bg-slate-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-slate-700', to: 'bg-[var(--secondary)]' },
      { from: 'bg-slate-800', to: 'bg-[var(--card)]' },
      { from: 'bg-slate-900', to: 'bg-[var(--background)]' },
      { from: 'bg-blue-50', to: 'bg-[var(--card)]' },
      { from: 'bg-blue-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-blue-600', to: 'bg-[var(--primary)]' },
      { from: 'bg-blue-700', to: 'bg-[var(--primary)]' },
      { from: 'bg-green-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-green-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-green-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-red-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-red-500', to: 'bg-[var(--destructive)]' },
      { from: 'bg-red-600', to: 'bg-[var(--destructive)]' },
      { from: 'bg-purple-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-purple-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-purple-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-orange-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-orange-500', to: 'bg-[var(--primary)]' },
      { from: 'bg-orange-600', to: 'bg-[var(--primary)]' },
      { from: 'bg-teal-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-teal-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-teal-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-indigo-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-indigo-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-indigo-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-emerald-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-emerald-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-emerald-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-violet-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-violet-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-violet-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-amber-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-amber-500', to: 'bg-[var(--primary)]' },
      { from: 'bg-amber-600', to: 'bg-[var(--primary)]' },
      { from: 'bg-cyan-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-cyan-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-cyan-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-pink-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-pink-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-pink-600', to: 'bg-[var(--accent)]' },
      { from: 'bg-rose-100', to: 'bg-[var(--secondary)]' },
      { from: 'bg-rose-500', to: 'bg-[var(--accent)]' },
      { from: 'bg-rose-600', to: 'bg-[var(--accent)]' }
    ];

    // Replace hardcoded border colors
    const borderReplacements = [
      { from: 'border-gray-200', to: 'border-[var(--border)]' },
      { from: 'border-gray-600', to: 'border-[var(--border)]' },
      { from: 'border-gray-800', to: 'border-[var(--border)]' },
      { from: 'border-slate-200', to: 'border-[var(--border)]' },
      { from: 'border-slate-600', to: 'border-[var(--border)]' },
      { from: 'border-blue-200', to: 'border-[var(--border)]' },
      { from: 'border-blue-500', to: 'border-[var(--primary)]' },
      { from: 'border-green-200', to: 'border-[var(--border)]' },
      { from: 'border-red-200', to: 'border-[var(--border)]' },
      { from: 'border-purple-200', to: 'border-[var(--border)]' },
      { from: 'border-orange-200', to: 'border-[var(--border)]' },
      { from: 'border-teal-200', to: 'border-[var(--border)]' },
      { from: 'border-indigo-200', to: 'border-[var(--border)]' },
      { from: 'border-emerald-200', to: 'border-[var(--border)]' },
      { from: 'border-violet-200', to: 'border-[var(--border)]' },
      { from: 'border-amber-200', to: 'border-[var(--border)]' },
      { from: 'border-cyan-200', to: 'border-[var(--border)]' },
      { from: 'border-pink-200', to: 'border-[var(--border)]' },
      { from: 'border-rose-200', to: 'border-[var(--border)]' }
    ];

    // Replace hardcoded hover colors
    const hoverReplacements = [
      { from: 'hover:bg-gray-100', to: 'hover:bg-[var(--secondary)]' },
      { from: 'hover:bg-gray-700', to: 'hover:bg-[var(--secondary)]' },
      { from: 'hover:bg-slate-100', to: 'hover:bg-[var(--secondary)]' },
      { from: 'hover:bg-slate-700', to: 'hover:bg-[var(--secondary)]' },
      { from: 'hover:bg-blue-700', to: 'hover:bg-[var(--primary)] hover:opacity-80' },
      { from: 'hover:bg-green-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-red-700', to: 'hover:bg-[var(--destructive)] hover:opacity-80' },
      { from: 'hover:bg-purple-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-orange-700', to: 'hover:bg-[var(--primary)] hover:opacity-80' },
      { from: 'hover:bg-teal-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-indigo-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-emerald-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-violet-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-amber-700', to: 'hover:bg-[var(--primary)] hover:opacity-80' },
      { from: 'hover:bg-cyan-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-pink-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:bg-rose-700', to: 'hover:bg-[var(--accent)] hover:opacity-80' },
      { from: 'hover:text-gray-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-blue-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-green-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-red-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-purple-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-orange-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-teal-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-indigo-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-emerald-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-violet-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-amber-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-cyan-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-pink-100', to: 'hover:text-[var(--accent-foreground)]/80' },
      { from: 'hover:text-rose-100', to: 'hover:text-[var(--accent-foreground)]/80' }
    ];

    // Apply all replacements
    const allReplacements = [
      ...textReplacements,
      ...bgReplacements,
      ...borderReplacements,
      ...hoverReplacements
    ];

    allReplacements.forEach(replacement => {
      const regex = new RegExp(replacement.from, 'g');
      if (content.includes(replacement.from)) {
        content = content.replace(regex, replacement.to);
        updated = true;
      }
    });

    // Special cases for complex patterns
    if (content.includes('bg-white/')) {
      content = content.replace(/bg-white\/(\d+)/g, 'bg-[var(--card)]/$1');
      updated = true;
    }

    if (content.includes('text-white/')) {
      content = content.replace(/text-white\/(\d+)/g, 'text-[var(--accent-foreground)]/$1');
      updated = true;
    }

    if (content.includes('border-white/')) {
      content = content.replace(/border-white\/(\d+)/g, 'border-[var(--border)]/$1');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Function to recursively find and update all TSX files
function updateAllFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      updateAllFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateFile(filePath);
    }
  });
}

// Start the update process
console.log('Starting comprehensive color fix...');
updateAllFiles('./app');
updateAllFiles('./components');
console.log('Color fix complete!');
