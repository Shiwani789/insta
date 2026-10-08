"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followController = exports.FollowController = void 0;
const follow_service_1 = require("./follow.service");
class FollowController {
    async follow(req, res, next) {
        try {
            const result = await follow_service_1.followService.follow(req.user.id, req.params.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async unfollow(req, res, next) {
        try {
            const result = await follow_service_1.followService.unfollow(req.user.id, req.params.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async acceptRequest(req, res, next) {
        try {
            const result = await follow_service_1.followService.acceptRequest(req.user.id, req.params.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async rejectRequest(req, res, next) {
        try {
            const result = await follow_service_1.followService.rejectRequest(req.user.id, req.params.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FollowController = FollowController;
exports.followController = new FollowController();
