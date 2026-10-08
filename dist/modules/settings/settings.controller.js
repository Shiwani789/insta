"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsController = exports.SettingsController = void 0;
const settings_service_1 = require("./settings.service");
class SettingsController {
    async getPrivacy(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.getPrivacy(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async updatePrivacy(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.updatePrivacy(req.user.id, req.body.isPrivate);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async updateInteractionSettings(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.updateInteractionSettings(req.user.id, req.body);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlocked(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.getBlocked(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async blockUser(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.blockUser(req.user.id, req.params.userId);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async unblockUser(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.unblockUser(req.user.id, req.params.userId);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async muteUser(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.muteUser(req.user.id, req.params.userId, req.body);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async requestDataExport(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.requestDataExport(req.user.id);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async deactivateAccount(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.deactivateAccount(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAccount(req, res, next) {
        try {
            const data = await settings_service_1.settingsService.deleteAccount(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SettingsController = SettingsController;
exports.settingsController = new SettingsController();
