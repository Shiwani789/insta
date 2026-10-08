"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedController = exports.FeedController = void 0;
const feed_service_1 = require("./feed.service");
const mobile_response_1 = require("../../common/utils/mobile-response");
class FeedController {
    async getFeed(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const result = await feed_service_1.feedService.getFeed(req.user.id, cursor, limit ? parseInt(limit, 10) : 20);
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            res.status(200).json({
                success: true,
                data: { ...result, items: result.items.map((post) => (0, mobile_response_1.mobilePost)(post, baseUrl)) },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FeedController = FeedController;
exports.feedController = new FeedController();
