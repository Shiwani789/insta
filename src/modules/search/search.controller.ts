import { Request, Response, NextFunction } from 'express';
import { searchService } from './search.service';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      const result = await searchService.search(q as string || '');
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
