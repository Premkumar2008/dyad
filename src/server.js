const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./config/logger');

(async function startServer() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', { error: err.message });
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message });
    process.exit(1);
  });
})();
