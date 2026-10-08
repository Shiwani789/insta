import { Request, Response, NextFunction } from 'express';
import { postService } from './post.service';
import { mobilePost } from '../../common/utils/mobile-response';

export class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.createPost(req.user!.id, req.body);
      res.status(201).json({ success: true, message: 'Post created successfully', data: mobilePost(post, `${req.protocol}://${req.get('host')}`) });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.getPostById(req.params.id as string, req.user?.id);
      res.status(200).json({ success: true, data: mobilePost(post, `${req.protocol}://${req.get('host')}`) });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await postService.deletePost(req.params.id as string, req.user!.id);
      res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
