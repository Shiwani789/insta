import { Request, Response, NextFunction } from 'express';
import { likeService } from './like.service';

export class LikeController {
  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await likeService.likePost(req.user!.id, req.params.postId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await likeService.unlikePost(req.user!.id, req.params.postId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPostLikes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await likeService.getPostLikes(req.params.postId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const likeController = new LikeController();
