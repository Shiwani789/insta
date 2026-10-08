import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Use parsed/defaulted/transformed values downstream (including
      // compatibility transforms such as mediaUrls -> media).
      if (parsed && typeof parsed === 'object' && 'body' in parsed) {
        req.body = (parsed as { body: unknown }).body;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: error.issues,
          },
        });
      }
      next(error);
    }
  };
};
