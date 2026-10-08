import { Request, Response, NextFunction } from 'express';
import { storyService } from './story.service';

export class StoryController {
  async createStory(req: Request, res: Response, next: NextFunction) {
    try {
      const story = await storyService.createStory(req.user!.id, req.body);
      res.status(201).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  async getStories(req: Request, res: Response, next: NextFunction) {
    try {
      const stories = await storyService.getStories(req.user!.id);
      res.status(200).json({ success: true, data: stories });
    } catch (error) {
      next(error);
    }
  }

  async viewStory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await storyService.viewStory(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async reactToStory(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      const result = await storyService.reactToStory(req.user!.id, req.params.id as string, type);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteStory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await storyService.deleteStory(req.user!.id, req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const storyController = new StoryController();
