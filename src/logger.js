const fs = require('fs');
const path = require('path');
const winston = require('winston');
const config = require('./config');

// Crear directorio de logs si no existe
const logDir = path.dirname(config.logFilePath);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} - ${level.toUpperCase()} - ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: config.logFilePath }),
        new winston.transports.Console()
    ]
});

module.exports = logger;
