const express = require('express');
const morgan = require('morgan');
const { NODE_ENV } = require('./config/env');
const logger = require('./config/logger');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Auth API is running',
    endpoints: {
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      me: 'GET /api/v1/auth/me',
      adminUsers: 'GET /api/v1/admin/users'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(globalErrorHandler);

if (NODE_ENV === 'development') {
  logger.info('Express app configured in development mode');
}

module.exports = app;
