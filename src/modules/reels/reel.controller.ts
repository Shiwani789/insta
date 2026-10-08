import { Request, Response, NextFunction } from 'express';
import { reelService } from './reel.service';

export class ReelController {
  async createReel(req: Request, res: Response, next: NextFunction) {
    try {
      const reel = await reelService.createReel(req.user!.id, req.body);
      res.status(201).json({ success: true, data: reel });
    } catch (error) {
      next(error);
    }
  }

  async getReelFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const reels = await reelService.getReelFeed(
        req.user!.id,
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 10
      );
      res.status(200).json({ success: true, data: reels });
    } catch (error) {
      next(error);
    }
  }

  async getReelById(req: Request, res: Response, next: NextFunction) {
    try {
      const reel = await reelService.getReelById(req.params.id as string, req.user!.id);
      res.status(200).json({ success: true, data: reel });
    } catch (error) {
      next(error);
    }
  }

  async deleteReel(req: Request, res: Response, next: NextFunction) {
    try {
      await reelService.deleteReel(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, message: 'Reel deleted' });
    } catch (error) {
      next(error);
    }
  }

  async likeReel(req: Request, res: Response, next: NextFunction) {
    try {
      await reelService.likeReel(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, message: 'Reel liked' });
    } catch (error) {
      next(error);
    }
  }

  async unlikeReel(req: Request, res: Response, next: NextFunction) {
    try {
      await reelService.unlikeReel(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, message: 'Reel unliked' });
    } catch (error) {
      next(error);
    }
  }
}

export const reelController = new ReelController();
