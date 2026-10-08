import { Request, Response, NextFunction } from 'express';
import { settingsService } from './settings.service';

export class SettingsController {
  async getPrivacy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.getPrivacy(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async updatePrivacy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.updatePrivacy(req.user!.id, req.body.isPrivate);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async updateInteractionSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.updateInteractionSettings(req.user!.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getBlocked(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.getBlocked(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.blockUser(req.user!.id, req.params.userId as string);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.unblockUser(req.user!.id, req.params.userId as string);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async muteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.muteUser(req.user!.id, req.params.userId as string, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async requestDataExport(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.requestDataExport(req.user!.id);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.deactivateAccount(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await settingsService.deleteAccount(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export const settingsController = new SettingsController();
