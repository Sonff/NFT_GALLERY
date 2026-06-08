const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

const writeToFile = (message) => {
  try {
    const logFile = path.join(LOGS_DIR, 'server.log');
    fs.appendFileSync(logFile, message + '\n');
  } catch (err) {
    console.error('Failed to write log to file:', err.message);
  }
};

const logger = {
  info: (message) => {
    const formatted = formatMessage('info', message);
    console.log(`\x1b[32m%s\x1b[0m`, formatted); // Green
    writeToFile(formatted);
  },
  warn: (message) => {
    const formatted = formatMessage('warn', message);
    console.log(`\x1b[33m%s\x1b[0m`, formatted); // Yellow
    writeToFile(formatted);
  },
  error: (message) => {
    const formatted = formatMessage('error', message);
    console.error(`\x1b[31m%s\x1b[0m`, formatted); // Red
    writeToFile(formatted);
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const formatted = formatMessage('debug', message);
      console.log(`\x1b[36m%s\x1b[0m`, formatted); // Cyan
      writeToFile(formatted);
    }
  }
};

module.exports = logger;
