import { Request, Response, NextFunction } from 'express';
import { messageService } from './message.service';

export class MessageController {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const convos = await messageService.getConversations(req.user!.id);
      res.status(200).json({ success: true, data: convos });
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const msgs = await messageService.getConversationMessages(
        req.user!.id,
        req.params.conversationId as string,
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 20
      );
      res.status(200).json({ success: true, data: msgs });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await messageService.sendMessage(req.user!.id, req.params.conversationId as string, req.body);
      res.status(201).json({ success: true, data: msg });
    } catch (error) {
      next(error);
    }
  }

  async createDirectConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetUserId } = req.body;
      const convo = await messageService.createDirectConversation(req.user!.id, targetUserId);
      res.status(201).json({ success: true, data: convo });
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();
