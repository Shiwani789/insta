import { Request, Response, NextFunction } from 'express';
import { followService } from './follow.service';

export class FollowController {
  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await followService.follow(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await followService.unfollow(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await followService.acceptRequest(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await followService.rejectRequest(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const followController = new FollowController();
