const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const db = require('./db'); // Import the SQLite database connection
const { sanitizePGN, extractPGNMetadata } = require('./utils/pgnSanitizer'); // Import PGN sanitizer

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://co2023yashkhanvilkar:906472@chess-training-cluster.5nq1gpd.mongodb.net/?retryWrites=true&w=majority&appName=chess-training-cluster', {
  dbName: 'pgn_database',
})
.then(() => console.log('MongoDB connected to pgn_database...'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);

// SQLite PGN Routes
app.post('/api/pgns', (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    // Sanitize the PGN content before saving
    let sanitizedContent;
    try {
      sanitizedContent = sanitizePGN(content);
    } catch (sanitizeError) {
      console.error('PGN sanitization failed:', sanitizeError);
      return res.status(400).json({ 
        error: 'Invalid PGN format. Please check your PGN and try again.',
        details: sanitizeError.message 
      });
    }

    // Extract metadata from the sanitized PGN
    const metadata = extractPGNMetadata(sanitizedContent);
    
    // Use the original name or generate one from metadata
    const finalName = name || `${metadata.white || 'Unknown'} vs ${metadata.black || 'Unknown'}`;

    const stmt = db.prepare('INSERT INTO pgns (name, content) VALUES (?, ?)');
    const result = stmt.run(finalName, sanitizedContent);

    res.json({ 
      message: 'PGN saved successfully',
      id: result.lastInsertRowid,
      metadata: metadata
    });
  } catch (error) {
    console.error('Error saving PGN:', error);
    res.status(500).json({ error: 'Failed to save PGN' });
  }
});

app.get('/api/pgns', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, name, created_at FROM pgns ORDER BY created_at DESC');
    const pgns = stmt.all();
    res.json(pgns);
  } catch (error) {
    console.error('Error fetching PGNs:', error);
    res.status(500).json({ error: 'Failed to fetch PGNs' });
  }
});

// Get specific PGN
app.get('/api/pgns/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM pgns WHERE id = ?');
    const pgn = stmt.get(req.params.id);
    
    if (!pgn) {
      return res.status(404).json({ error: 'PGN not found' });
    }

    console.log(`Backend: PGN content length for ID ${pgn.id}: ${pgn.content ? pgn.content.length : 0}`);
    
    res.json(pgn);
  } catch (error) {
    console.error('Error fetching PGN:', error);
    res.status(500).json({ error: 'Failed to fetch PGN' });
  }
});

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Backend Error:", err.message);
  console.error(err.stack); // Log the stack trace for more details
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

// Set server timeout to 5 minutes (300,000 ms) for large PGN uploads
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/analysis/analyze');
  console.log('- GET /api/analysis/history');
  console.log('- POST /api/pgns');
  console.log('- GET /api/pgns');
  console.log('- GET /api/pgns/:id');
});
server.timeout = 300000; 