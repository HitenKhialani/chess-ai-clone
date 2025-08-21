-- Create simplo_chats table
CREATE TABLE IF NOT EXISTS simplo_chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create simplo_messages table
CREATE TABLE IF NOT EXISTS simplo_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    image TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES simplo_chats(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_simplo_chats_user_id ON simplo_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_simplo_chats_updated_at ON simplo_chats(updated_at);
CREATE INDEX IF NOT EXISTS idx_simplo_messages_chat_id ON simplo_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_simplo_messages_timestamp ON simplo_messages(timestamp); 