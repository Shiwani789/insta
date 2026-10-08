"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exploreController = exports.ExploreController = void 0;
const explore_service_1 = require("./explore.service");
class ExploreController {
    async getExploreContent(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const result = await explore_service_1.exploreService.getExploreContent(cursor, limit ? parseInt(limit, 10) : 20);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ExploreController = ExploreController;
exports.exploreController = new ExploreController();
