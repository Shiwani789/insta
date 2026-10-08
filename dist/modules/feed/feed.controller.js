"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedController = exports.FeedController = void 0;
const feed_service_1 = require("./feed.service");
class FeedController {
    async getFeed(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const result = await feed_service_1.feedService.getFeed(req.user.id, cursor, limit ? parseInt(limit, 10) : 20);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FeedController = FeedController;
exports.feedController = new FeedController();
