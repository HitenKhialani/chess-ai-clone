const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, 'jwtSecret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all chats for a user
router.get('/chats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user.user?.id;
    console.log('Fetching chats for userId:', userId);
    console.log('User object:', req.user);
    
    const stmt = db.prepare(`
      SELECT 
        c.id as _id,
        c.title,
        c.created_at as createdAt,
        c.updated_at as updatedAt,
        COUNT(m.id) as messageCount,
        COALESCE(m2.content, 'No messages yet') as preview
      FROM simplo_chats c
      LEFT JOIN simplo_messages m ON c.id = m.chat_id
      LEFT JOIN (
        SELECT chat_id, content 
        FROM simplo_messages 
        WHERE role = 'user' 
        ORDER BY timestamp ASC 
        LIMIT 1
      ) m2 ON c.id = m2.chat_id
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `);
    
    const chats = stmt.all(userId);
    console.log('Found chats:', chats.length);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get a specific chat by ID
router.get('/chats/:chatId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user.user?.id;
    const chatId = req.params.chatId;
    
    // Get chat info
    const chatStmt = db.prepare('SELECT * FROM simplo_chats WHERE id = ? AND user_id = ?');
    const chat = chatStmt.get(chatId, userId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Get messages for this chat
    const messagesStmt = db.prepare('SELECT * FROM simplo_messages WHERE chat_id = ? ORDER BY timestamp ASC');
    const messages = messagesStmt.all(chatId);
    
    const result = {
      _id: chat.id,
      userId: chat.user_id,
      title: chat.title,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        image: msg.image
      }))
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Create a new chat
router.post('/chats', authenticateToken, async (req, res) => {
  try {
    const { title, initialMessage } = req.body;
    const userId = req.user.userId || req.user.id || req.user.user?.id;
    
    console.log('Creating chat for userId:', userId);
    console.log('Chat data:', { title, initialMessage });
    
    // Create the chat
    const chatStmt = db.prepare('INSERT INTO simplo_chats (user_id, title) VALUES (?, ?)');
    const chatResult = chatStmt.run(userId, title || 'New Chat');
    const chatId = chatResult.lastInsertRowid;
    
    // Add initial message if provided
    if (initialMessage) {
      const messageStmt = db.prepare('INSERT INTO simplo_messages (chat_id, role, content, image) VALUES (?, ?, ?, ?)');
      messageStmt.run(chatId, initialMessage.role, initialMessage.content, initialMessage.image || null);
    }
    
    // Get the created chat
    const getChatStmt = db.prepare('SELECT * FROM simplo_chats WHERE id = ?');
    const chat = getChatStmt.get(chatId);
    
    const result = {
      _id: chat.id,
      userId: chat.user_id,
      title: chat.title,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
      messages: []
    };
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Add message to existing chat
router.post('/chats/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { role, content, image } = req.body;
    const userId = req.user.userId || req.user.id || req.user.user?.id;
    const chatId = req.params.chatId;
    
    // Verify chat belongs to user
    const chatStmt = db.prepare('SELECT * FROM simplo_chats WHERE id = ? AND user_id = ?');
    const chat = chatStmt.get(chatId, userId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Add the message
    const messageStmt = db.prepare('INSERT INTO simplo_messages (chat_id, role, content, image) VALUES (?, ?, ?, ?)');
    const messageResult = messageStmt.run(chatId, role, content, image || null);
    
    // Update chat title if it's the first user message
    if (role === 'user') {
      const messageCountStmt = db.prepare('SELECT COUNT(*) as count FROM simplo_messages WHERE chat_id = ? AND role = ?');
      const messageCount = messageCountStmt.get(chatId, 'user');
      
      if (messageCount.count === 1) {
        const updateTitleStmt = db.prepare('UPDATE simplo_chats SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        const newTitle = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        updateTitleStmt.run(newTitle, chatId);
      }
    }
    
    // Update chat timestamp
    const updateChatStmt = db.prepare('UPDATE simplo_chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    updateChatStmt.run(chatId);
    
    const newMessage = {
      id: messageResult.lastInsertRowid,
      role,
      content,
      image: image || null,
      timestamp: new Date().toISOString()
    };
    
    res.json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update chat title
router.put('/chats/:chatId/title', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId || req.user.id || req.user.user?.id;
    const chatId = req.params.chatId;
    
    const stmt = db.prepare('UPDATE simplo_chats SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?');
    const result = stmt.run(title, chatId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json({ title });
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
});

// Delete a chat
router.delete('/chats/:chatId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user.user?.id;
    const chatId = req.params.chatId;
    
    const stmt = db.prepare('DELETE FROM simplo_chats WHERE id = ? AND user_id = ?');
    const result = stmt.run(chatId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router; 