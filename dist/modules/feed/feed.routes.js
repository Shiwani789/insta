"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feed_controller_1 = require("./feed.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
router.get('/feed', auth_1.authMiddleware, feed_controller_1.feedController.getFeed);
exports.default = router;
