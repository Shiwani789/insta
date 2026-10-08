import { Request, Response, NextFunction } from 'express';
import { exploreService } from './explore.service';

export class ExploreController {
  async getExploreContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const result = await exploreService.getExploreContent(
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 20
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const exploreController = new ExploreController();
