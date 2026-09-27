import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Custom operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
    return;
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          message: 'The requested record was not found.',
        },
      });
      return;
    }

    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: {
          message: 'A record with this unique field already exists.',
          target: err.meta?.target,
        },
      });
      return;
    }
  }

  // Fallback for unhandled internal errors
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error occurred.'
          : err.message || 'Internal server error',
    },
  });
};
