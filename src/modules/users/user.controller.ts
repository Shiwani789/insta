import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserByUsername(req.params.username as string, req.user?.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.user!.id, req.user!.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.user!.id, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No photo uploaded' });
      }
      const file = files[0];
      const data = await userService.updateProfilePhoto(req.user!.id, `/uploads/${file.filename}`);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.deleteProfilePhoto(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const data = await userService.getUserPosts(
        req.params.userId as string,
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 12
      );
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }

  async getUserReels(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit } = req.query;
      const data = await userService.getUserReels(
        req.params.userId as string,
        cursor as string | undefined,
        limit ? parseInt(limit as string, 10) : 12
      );
      res.status(200).json({ success: true, data });
    } catch (error) { next(error); }
  }
}

export const userController = new UserController();
