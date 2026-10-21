import { Request, Response, NextFunction } from 'express';
import { formatApiResponse } from '../utils/validators.js';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId Cast Error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found or invalid ID format';
  }

  // Handle Duplicate Field Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An entry with this ${field} already exists`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val: any) => val.message);
    return res.status(statusCode).json(formatApiResponse(false, 'Validation Failed', null, errors));
  }

  console.error(`[ Express Error Handler ] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json(
    formatApiResponse(false, message, null, process.env.NODE_ENV === 'development' ? [err.stack] : [])
  );
};
