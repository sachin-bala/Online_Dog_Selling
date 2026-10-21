import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import path from 'path';
import fs from 'fs';
import { env } from './config/environment.js';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import dogRoutes from './routes/dogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dogShowRoutes from './routes/dogShowRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Security & Utility Middleware
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve local uploads statically
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Development Request Logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[PAWVERSE API] [REQUEST] ${req.method} ${req.path}`);
  }
  next();
});

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// API Welcome & Health Check Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PawVerse AI Full-Stack API Server 🐾',
    healthCheck: 'http://localhost:5000/api/health',
    dogsApi: 'http://localhost:5000/api/dogs',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PawVerse AI Backend API Base Endpoint Active 🐾',
    endpoints: {
      health: '/api/health',
      dogs: '/api/dogs',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      dogShows: '/api/dog-shows',
      aiBreedRecommendation: '/api/ai/breed-recommendation',
    },
    timestamp: new Date().toISOString(),
  });
});

// Database Health Check Endpoint (Requirement #1)
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const statusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isConnected = dbState === 1;

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    message: isConnected ? 'PawVerse API and MongoDB database connected' : 'Database disconnected',
    database: {
      status: statusMap[dbState] || 'unknown',
      name: mongoose.connection.name || 'pawverse',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dog-shows', dogShowRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productRoutes);

// Global Error Middleware
app.use(errorHandler);

// Socket.IO Connection & Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
  if (!token) return next();

  try {
    const cleanToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanToken, env.JWT_SECRET) as any;
    (socket as any).userId = decoded.id;
  } catch {
    console.warn('[ Socket.IO Auth ] Unauthenticated connection attempt allowed for general chat');
  }
  next();
});

io.on('connection', (socket) => {
  const userId = (socket as any).userId || socket.id;
  console.log(`[ Socket.IO Connected ] User ID: ${userId}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId || 'global_chat').emit('receive_message', {
      id: `msg_${Date.now()}`,
      sender: data.sender || 'user',
      text: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dogId: data.dogId,
    });
  });

  socket.on('disconnect', () => {
    console.log(`[ Socket.IO Disconnected ] ${userId}`);
  });
});

// Startup Server
const PORT = env.PORT;

const startServer = async () => {
  await connectDB();

  try {
    const { Dog } = await import('./models/Dog.js');
    const count = await Dog.countDocuments();
    if (count === 0) {
      console.log('[ PawVerse DB ] Database empty, running auto-seed...');
      const { seedDatabase } = await import('./seed.js');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.warn('[ PawVerse DB ] Auto-seed check error:', seedErr);
  }

  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`PawVerse API Server running on:`);
    console.log(`http://localhost:${PORT}/`);
    console.log(`API Base URL:`);
    console.log(`http://localhost:${PORT}/api`);
    console.log(`==================================================\n`);
  });
};

startServer();
