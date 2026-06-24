const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'FoodBridge API is running', timestamp: new Date() });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB connection
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
      // Only listen if not in a serverless environment (like Vercel)
      if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        server.listen(process.env.PORT || 5000, () => {
          console.log(`🚀 FoodBridge server running on port ${process.env.PORT || 5000}`);
        });
      }
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
}

module.exports = app;
