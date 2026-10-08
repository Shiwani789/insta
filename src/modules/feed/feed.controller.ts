import { Request, Response, NextFunction } from 'express';
import { feedService } from './feed.service';
import { mobilePost } from '../../common/utils/mobile-response';

export class FeedController {
  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const result = await feedService.getFeed(
        req.user!.id,
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 20
      );
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      res.status(200).json({
        success: true,
        data: { ...result, items: result.items.map((post) => mobilePost(post, baseUrl)) },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const feedController = new FeedController();
