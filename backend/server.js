import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';

import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import clientRoutes from './routes/clientRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 1. GLOBAL MIDDLEWARES

// Compress API responses
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Implement CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Custom Data Sanitization against NoSQL query injection
// This is a safe alternative to express-mongo-sanitize
const sanitize = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
         delete obj[key];
      } else {
         sanitize(obj[key]);
      }
    }
  }
  return obj;
};

app.use((req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
});

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['role', 'createdAt'] // Allow these parameters to be duplicated if needed
}));

// Routes
app.get('/', (req, res) => {
  res.send('API is running securely...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/clients', clientRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR 💥:', err); // Log the error for diagnostics
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
