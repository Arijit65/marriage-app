require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import existing routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const rrRoutes = require('./routes/rrRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
// const adRoutes = require('./routes/adRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(express.static('public')); // Middleware for serving static files from 'public' directory

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});


// Middleware for parsing form data (for file uploads)
app.use('/uploads', express.static('uploads'));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rr', rrRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
// app.use('/api/ads', adRoutes);

// Error handling middleware (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);



// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.log('Server will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('Server will continue running...');
});

// DB connection and server start
db.sequelize.sync().then(() => {
  console.log('✅ MySQL DB synced');
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

}).catch((err) => {
  console.error('❌ Failed to connect DB:', err);
  process.exit(1);
});