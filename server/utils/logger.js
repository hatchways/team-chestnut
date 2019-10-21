const winston = require ('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    transports: [
      new winston.transports.File({
        filename: "./utils/logs/info.log",
        level: "info"
      }),
      new winston.transports.File({
        filename: "./utils/logs/errors.log",
        level: "error"
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: "./utils/logs/exceptions.log" })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    }));
  }

  module.exports = logger;