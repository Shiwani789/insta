"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("./user.service");
class UserController {
    async getProfile(req, res, next) {
        try {
            const user = await user_service_1.userService.getUserByUsername(req.params.username, req.user?.id);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async getMyProfile(req, res, next) {
        try {
            const user = await user_service_1.userService.getUserById(req.user.id, req.user.id);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const user = await user_service_1.userService.updateProfile(req.user.id, req.body);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfilePhoto(req, res, next) {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ success: false, message: 'No photo uploaded' });
            }
            const file = files[0];
            const data = await user_service_1.userService.updateProfilePhoto(req.user.id, `/uploads/${file.filename}`);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteProfilePhoto(req, res, next) {
        try {
            const data = await user_service_1.userService.deleteProfilePhoto(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserPosts(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const data = await user_service_1.userService.getUserPosts(req.params.userId, cursor, limit ? parseInt(limit, 10) : 12);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserReels(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const data = await user_service_1.userService.getUserReels(req.params.userId, cursor, limit ? parseInt(limit, 10) : 12);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
