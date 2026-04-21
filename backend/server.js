const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const assessmentRoutes = require('./routes/assessment');
const subscriptionRoutes = require('./routes/subscription');
const supportRoutes = require('./routes/support');
const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? ['https://your-frontend-domain.com'] : ['http://localhost:3000'],
    credentials: true,
  })
);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log(`Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Make sure to set MONGODB_URI in config.env');
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/support', supportRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
