import { Request, Response, NextFunction } from 'express';

// Define Open Payments specific error types
interface OpenPaymentsError extends Error {
  status?: number;
  code?: string;
  description?: string;
  validation_errors?: any[];
}

// Error types specific to Open Payments flow
export enum PaymentErrorTypes {
  WALLET_ADDRESS_NOT_FOUND = 'WALLET_ADDRESS_NOT_FOUND',
  GRANT_REQUEST_FAILED = 'GRANT_REQUEST_FAILED',
  INCOMING_PAYMENT_FAILED = 'INCOMING_PAYMENT_FAILED',
  QUOTE_CREATION_FAILED = 'QUOTE_CREATION_FAILED',
  OUTGOING_PAYMENT_AUTH_FAILED = 'OUTGOING_PAYMENT_AUTH_FAILED',
  OUTGOING_PAYMENT_FAILED = 'OUTGOING_PAYMENT_FAILED',
  INTERACTIVE_GRANT_REQUIRED = 'INTERACTIVE_GRANT_REQUIRED',
  ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
  PAYMENT_AUTHORIZATION_DENIED = 'PAYMENT_AUTHORIZATION_DENIED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

// Custom error class for Open Payments
export class OpenPaymentsApiError extends Error {
  public status: number;
  public code: string;
  public details?: any;

  constructor(message: string, status: number = 500, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'OpenPaymentsApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Error handler middleware
export const errorHandler = (
  error: OpenPaymentsError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific Open Payments errors based on the flow
  if (error.name === 'OpenPaymentsApiError' || error.code) {
    return handleOpenPaymentsError(error, res);
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.message,
      details: error.validation_errors || []
    });
  }

  // Handle network/connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Unable to connect to payment service',
      code: 'SERVICE_UNAVAILABLE'
    });
  }

  // Handle timeout errors
  if (error.code === 'ETIMEDOUT') {
    return res.status(408).json({
      error: 'Request timeout',
      message: 'Payment request timed out',
      code: 'REQUEST_TIMEOUT'
    });
  }

  // Handle JWT/Auth errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or expired access token',
      code: 'AUTH_FAILED'
    });
  }

  // Default error response
  const status = error.status || 500;
  const message = status === 500 ? 'Internal server error' : error.message;

  return res.status(status).json({
    error: 'Server error',
    message,
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Handle specific Open Payments errors based on the flow stages
function handleOpenPaymentsError(error: OpenPaymentsError, res: Response) {
  const { status = 500, code, message } = error;

  switch (code) {
    // Wallet Address Resolution Errors (Step 1 of flow)
    case PaymentErrorTypes.WALLET_ADDRESS_NOT_FOUND:
      return res.status(404).json({
        error: 'Wallet address not found',
        message: 'The specified wallet address could not be resolved',
        code: 'WALLET_ADDRESS_NOT_FOUND',
        suggestion: 'Verify the wallet address format and try again'
      });

    // Grant Request Errors (Steps 2, 4, 6 of flow)
    case PaymentErrorTypes.GRANT_REQUEST_FAILED:
      return res.status(403).json({
        error: 'Grant request failed',
        message: 'Unable to obtain authorization grant',
        code: 'GRANT_REQUEST_FAILED',
        suggestion: 'Check wallet permissions and authorization server availability'
      });

    // Incoming Payment Errors (Step 3 of flow)
    case PaymentErrorTypes.INCOMING_PAYMENT_FAILED:
      return res.status(400).json({
        error: 'Incoming payment creation failed',
        message: 'Unable to create incoming payment resource',
        code: 'INCOMING_PAYMENT_FAILED',
        suggestion: 'Verify payment amount and recipient wallet details'
      });

    // Quote Creation Errors (Step 5 of flow)
    case PaymentErrorTypes.QUOTE_CREATION_FAILED:
      return res.status(400).json({
        error: 'Quote creation failed',
        message: 'Unable to generate payment quote',
        code: 'QUOTE_CREATION_FAILED',
        suggestion: 'Check payment amount and currency compatibility'
      });

    // Interactive Grant Errors (Steps 7-14 of flow)
    case PaymentErrorTypes.INTERACTIVE_GRANT_REQUIRED:
      return res.status(402).json({
        error: 'User authorization required',
        message: 'Payment requires explicit user consent',
        code: 'INTERACTIVE_GRANT_REQUIRED',
        suggestion: 'Redirect user to authorization URL for payment approval'
      });

    case PaymentErrorTypes.PAYMENT_AUTHORIZATION_DENIED:
      return res.status(403).json({
        error: 'Payment authorization denied',
        message: 'User denied payment authorization',
        code: 'PAYMENT_AUTHORIZATION_DENIED',
        suggestion: 'User must approve the payment to proceed'
      });

    // Outgoing Payment Errors (Step 15 of flow)
    case PaymentErrorTypes.OUTGOING_PAYMENT_FAILED:
      return res.status(400).json({
        error: 'Outgoing payment failed',
        message: 'Unable to create outgoing payment',
        code: 'OUTGOING_PAYMENT_FAILED',
        suggestion: 'Verify quote validity and sender account balance'
      });

    case PaymentErrorTypes.INSUFFICIENT_FUNDS:
      return res.status(402).json({
        error: 'Insufficient funds',
        message: 'Sender account has insufficient balance',
        code: 'INSUFFICIENT_FUNDS',
        suggestion: 'Add funds to sender account and retry'
      });

    // Access Token Errors
    case PaymentErrorTypes.ACCESS_TOKEN_INVALID:
      return res.status(401).json({
        error: 'Invalid access token',
        message: 'Access token is expired or invalid',
        code: 'ACCESS_TOKEN_INVALID',
        suggestion: 'Refresh access token and retry request'
      });

    // Rate Limiting
    case PaymentErrorTypes.RATE_LIMIT_EXCEEDED:
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        suggestion: 'Wait before making additional requests'
      });

    default:
      return res.status(status).json({
        error: 'Payment processing error',
        message: message || 'An error occurred during payment processing',
        code: code || 'PAYMENT_ERROR'
      });
  }
}

// Helper function to create Open Payments errors
export const createPaymentError = (
  type: PaymentErrorTypes,
  message: string,
  status: number = 400,
  details?: any
): OpenPaymentsApiError => {
  return new OpenPaymentsApiError(message, status, type, details);
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    code: 'ROUTE_NOT_FOUND'
  });
};
