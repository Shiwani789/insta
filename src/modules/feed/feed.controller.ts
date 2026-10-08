import { Request, Response, NextFunction } from 'express';
import { feedService } from './feed.service';

export class FeedController {
  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const result = await feedService.getFeed(
        req.user!.id,
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 20
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const feedController = new FeedController();
