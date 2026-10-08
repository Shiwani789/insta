import { Request, Response, NextFunction } from 'express';
import { commentService } from './comment.service';

export class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, parentCommentId } = req.body;
      const result = await commentService.createComment(req.user!.id, req.params.postId as string, text, parentCommentId);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const result = await commentService.getComments(
        req.params.postId as string, 
        cursor as string | undefined, 
        limit ? parseInt(limit as string, 10) : 20
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commentService.updateComment(req.user!.id, req.params.commentId as string, req.body.text);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      await commentService.deleteComment(req.user!.id, req.params.commentId as string);
      res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
      next(error);
    }
  }

  async likeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commentService.likeComment(req.user!.id, req.params.commentId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async unlikeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commentService.unlikeComment(req.user!.id, req.params.commentId as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
