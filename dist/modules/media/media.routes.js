"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("./media.controller");
const auth_1 = require("../../common/middleware/auth");
const upload_1 = require("../../common/middleware/upload");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
// Allow uploading up to 10 files at once
router.post('/upload', upload_1.upload.array('media', 10), media_controller_1.mediaController.uploadMedia);
exports.default = router;
