const { LOG_LEVEL } = require('./env');

const levels = ['error', 'warn', 'info', 'debug'];
const configuredIndex = levels.indexOf(LOG_LEVEL) === -1 ? 2 : levels.indexOf(LOG_LEVEL);

function shouldLog(level) {
  const current = levels.indexOf(level);
  return current <= configuredIndex;
}

function log(level, message, meta = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };

  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
    return;
  }
  console.log(line);
}

module.exports = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta)
};
