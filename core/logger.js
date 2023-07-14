const winston = require('winston');


// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}\n`;
    })
  ),
  defaultMeta: { service: 'dummy_logger' },
  transports: [
    new winston.transports.File({ filename: 'dummy_log.log', level: 'info', dirname: 'logs' })
  ]
});




module.exports = logger;
