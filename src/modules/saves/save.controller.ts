import { Request, Response, NextFunction } from 'express';
import { saveService } from './save.service';

export class SaveController {
  async savePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await saveService.savePost(req.user!.id, req.params.postId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async unsavePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await saveService.unsavePost(req.user!.id, req.params.postId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSavedPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await saveService.getSavedPosts(req.user!.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const saveController = new SaveController();
