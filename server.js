const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const chatHandler = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

// API Routes
app.post('/api/chat', (req, res) => {
  return chatHandler(req, res);
});

// Fallback to index.html for single page layout
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Portfolio & AI Chatbot server running at: http://localhost:${PORT}`);
  console.log(`🤖 AI Endpoint active at: http://localhost:${PORT}/api/chat`);
  console.log(`===================================================`);
});
