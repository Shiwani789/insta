"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchController = exports.SearchController = void 0;
const search_service_1 = require("./search.service");
class SearchController {
    async search(req, res, next) {
        try {
            const { q } = req.query;
            const result = await search_service_1.searchService.search(q || '');
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SearchController = SearchController;
exports.searchController = new SearchController();
