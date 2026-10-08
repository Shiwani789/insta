"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reelController = exports.ReelController = void 0;
const reel_service_1 = require("./reel.service");
class ReelController {
    async createReel(req, res, next) {
        try {
            const reel = await reel_service_1.reelService.createReel(req.user.id, req.body);
            res.status(201).json({ success: true, data: reel });
        }
        catch (error) {
            next(error);
        }
    }
    async getReelFeed(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const reels = await reel_service_1.reelService.getReelFeed(req.user.id, cursor, limit ? parseInt(limit, 10) : 10);
            res.status(200).json({ success: true, data: reels });
        }
        catch (error) {
            next(error);
        }
    }
    async getReelById(req, res, next) {
        try {
            const reel = await reel_service_1.reelService.getReelById(req.params.id, req.user.id);
            res.status(200).json({ success: true, data: reel });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteReel(req, res, next) {
        try {
            await reel_service_1.reelService.deleteReel(req.user.id, req.params.id);
            res.status(200).json({ success: true, message: 'Reel deleted' });
        }
        catch (error) {
            next(error);
        }
    }
    async likeReel(req, res, next) {
        try {
            await reel_service_1.reelService.likeReel(req.user.id, req.params.id);
            res.status(200).json({ success: true, message: 'Reel liked' });
        }
        catch (error) {
            next(error);
        }
    }
    async unlikeReel(req, res, next) {
        try {
            await reel_service_1.reelService.unlikeReel(req.user.id, req.params.id);
            res.status(200).json({ success: true, message: 'Reel unliked' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReelController = ReelController;
exports.reelController = new ReelController();
