"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const explore_controller_1 = require("./explore.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
router.get('/explore', auth_1.authMiddleware, explore_controller_1.exploreController.getExploreContent);
exports.default = router;
