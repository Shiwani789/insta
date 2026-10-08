"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = exports.MediaController = void 0;
class MediaController {
    async uploadMedia(req, res, next) {
        try {
            const files = req.files;
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MediaController = MediaController;
exports.mediaController = new MediaController();
