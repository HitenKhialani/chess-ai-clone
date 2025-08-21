const bcrypt = require('bcryptjs');
const db = require('./db');

async function createTestUser() {
  try {
    const username = 'rambo';
    const email = 'rambo@gmail.com';
    const password = 'test123';
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert the user
    const stmt = db.prepare('INSERT INTO users (username, email, password, coins, total_time_spent, section_times, unlocked_courses) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword, 10, 0, '{}', '[]');
    
    console.log('Test user created successfully!');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', result.lastInsertRowid);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser(); 