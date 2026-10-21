import { Request, Response, NextFunction } from 'express';
import { formatApiResponse } from '../utils/validators.js';

export const validateRequestBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json(
        formatApiResponse(
          false,
          `Missing required fields: ${missingFields.join(', ')}`,
          null,
          missingFields.map((f) => `${f} is required`)
        )
      );
    }

    next();
  };
};
