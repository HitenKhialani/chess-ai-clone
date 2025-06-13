const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const pgnRoutes = require('./routes/pgnRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://co2023yashkhanvilkar:906472@chess-training-cluster.5nq1gpd.mongodb.net/?retryWrites=true&w=majority&appName=chess-training-cluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'pgn_database',
})
.then(() => console.log('MongoDB connected to pgn_database...'))
.catch(err => console.error(err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/pgns', pgnRoutes);

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Backend Error:", err.message);
  console.error(err.stack); // Log the stack trace for more details
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

// Set server timeout to 5 minutes (300,000 ms) for large PGN uploads
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.timeout = 300000; 