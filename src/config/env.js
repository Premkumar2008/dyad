const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://dummy-user:dummy-pass@dummy-cluster.mongodb.net/auth-db?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'replace_this_with_a_secure_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
