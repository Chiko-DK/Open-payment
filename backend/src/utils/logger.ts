import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

// Create Winston logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      
      // Add stack trace for errors
      if (stack) {
        log += `\n${stack}`;
      }
      
      // Add metadata if present
      if (Object.keys(meta).length > 0) {
        log += `\nMetadata: ${JSON.stringify(meta, null, 2)}`;
      }
      
      return log;
    })
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transport for all logs
    new winston.transports.File({ 
      filename: 'logs/app.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Separate file for errors
    new winston.transports.File({ 
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Don't exit on handled exceptions
  exitOnError: false
});

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' })
);

// Express middleware for request logging
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request details
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Capture response details
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    
    logger.log(logLevel, 'Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    });
  });

  next();
};

// Payment-specific logging functions
export const logPaymentEvent = (event: string, data: any) => {
  logger.info(`Payment Event: ${event}`, {
    event,
    paymentData: data,
    timestamp: new Date().toISOString()
  });
};

export const logPaymentError = (error: string, details: any) => {
  logger.error(`Payment Error: ${error}`, {
    error,
    details,
    timestamp: new Date().toISOString()
  });
};

// Open Payments specific logging
export const logOpenPaymentsAction = (action: string, walletAddress: string, data?: any) => {
  logger.info(`Open Payments: ${action}`, {
    action,
    walletAddress,
    data,
    timestamp: new Date().toISOString()
  });
};

// Security logging
export const logSecurityEvent = (event: string, details: any) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

export default logger;
