require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
// const auth = require("../middeleware/auth");
const auth = require('./middeleware/auth.js');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

// Connect to MongoDB
connectDB();

// Store active users
const activeUsers = new Map();
const messageQueues = new Map();

// Socket.IO middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Add user to active users
  activeUsers.set(socket.userId, socket.id);
  io.emit('online-users', Array.from(activeUsers.keys()));
  
  if (messageQueues.has(socket.userId)) {
    const queue = messageQueues.get(socket.userId);
    queue.forEach(msg => socket.emit('msg-receive', msg));
    messageQueues.delete(socket.userId);
  }

  socket.on('typing', (data) => {
    const { senderId, receiverId, isTyping } = data;
    
    if (senderId !== socket.userId) {
      console.log(`Spoof typing attempt from ${socket.userId} as ${senderId}`);
      return;
    }
    
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', {
        senderId,
        receiverId,
        isTyping
      });
    }
  });

  socket.on('send-msg', async (data) => {
    try {
      const { to, from, message } = data;
      
      if (from !== socket.userId) {
        console.log(`Spoof attempt from ${socket.userId} as ${from}`);
        return;
      }
      
      const newMessage = await mongoose.model('Message').create({
        sender: from,
        receiver: to,
        message
      });

      const populated = await newMessage.populate([
        { path: "sender", select: "name email avatarUrl" },
        { path: "receiver", select: "name email avatarUrl" }
      ]);

      const messageData = {
        _id: populated._id,
        senderId: populated.sender._id,
        receiverId: populated.receiver._id,
        message: populated.message,
        timestamp: populated.createdAt,
        sender: populated.sender,
        receiver: populated.receiver
      };

      const receiverSocket = activeUsers.get(to);
      if (receiverSocket) {
        io.to(receiverSocket).emit('msg-receive', messageData);
      } else {
        if (!messageQueues.has(to)) messageQueues.set(to, []);
        messageQueues.get(to).push(messageData);
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    activeUsers.delete(socket.userId);
    io.emit('online-users', Array.from(activeUsers.keys()));
  });
});


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', userRoutes);
app.use('/api/chat', auth, messageRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});