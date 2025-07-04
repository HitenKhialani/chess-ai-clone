const path = require('path');
const Database = require('better-sqlite3');

// Connect directly to the database file
const dbPath = path.join(__dirname, '..', 'chess.db');
const db = new Database(dbPath);
console.log(`Database opened for schema update: ${dbPath}`);

try {
    // Check if 'coins' column exists
    const coinsColumn = db.prepare("PRAGMA table_info(users)").all().find(col => col.name === 'coins');
    if (!coinsColumn) {
        console.log('Adding "coins" column to users table...');
        db.exec("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 20;");
        console.log('"coins" column added successfully.');
    } else {
        console.log('"coins" column already exists. Skipping.');
    }

    // Check if 'unlocked_courses' column exists
    const unlockedCoursesColumn = db.prepare("PRAGMA table_info(users)").all().find(col => col.name === 'unlocked_courses');
    if (!unlockedCoursesColumn) {
        console.log('Adding "unlocked_courses" column to users table...');
        db.exec("ALTER TABLE users ADD COLUMN unlocked_courses TEXT DEFAULT '[]';");
        console.log('"unlocked_courses" column added successfully.');
    } else {
        console.log('"unlocked_courses" column already exists. Skipping.');
    }

} catch (error) {
    console.error('An error occurred during schema update:', error.message);
} finally {
    db.close();
    console.log('Database connection closed.');
}

console.log('Database schema update process finished.'); 