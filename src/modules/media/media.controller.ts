import { Request, Response, NextFunction } from 'express';

export class MediaController {
  async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }

      const uploadedFiles = files.map(file => ({
        url: `/uploads/${file.filename}`,
        key: file.filename,
        mimeType: file.mimetype,
        size: file.size
      }));

      res.status(201).json({ success: true, data: uploadedFiles });
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
