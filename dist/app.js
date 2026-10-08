"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const follow_routes_1 = __importDefault(require("./modules/follows/follow.routes"));
const post_routes_1 = __importDefault(require("./modules/posts/post.routes"));
const like_routes_1 = __importDefault(require("./modules/likes/like.routes"));
const save_routes_1 = __importDefault(require("./modules/saves/save.routes"));
const comment_routes_1 = __importDefault(require("./modules/comments/comment.routes"));
const feed_routes_1 = __importDefault(require("./modules/feed/feed.routes"));
const explore_routes_1 = __importDefault(require("./modules/explore/explore.routes"));
const search_routes_1 = __importDefault(require("./modules/search/search.routes"));
const story_routes_1 = __importDefault(require("./modules/stories/story.routes"));
const reel_routes_1 = __importDefault(require("./modules/reels/reel.routes"));
const message_routes_1 = __importDefault(require("./modules/messages/message.routes"));
const notification_routes_1 = __importDefault(require("./modules/notifications/notification.routes"));
const media_routes_1 = __importDefault(require("./modules/media/media.routes"));
const settings_routes_1 = __importDefault(require("./modules/settings/settings.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api', follow_routes_1.default);
app.use('/api/posts', post_routes_1.default);
app.use('/api', like_routes_1.default);
app.use('/api', save_routes_1.default);
app.use('/api', comment_routes_1.default);
app.use('/api', feed_routes_1.default);
app.use('/api', explore_routes_1.default);
app.use('/api', search_routes_1.default);
app.use('/api/stories', story_routes_1.default);
app.use('/api/reels', reel_routes_1.default);
app.use('/api', message_routes_1.default);
app.use('/api', notification_routes_1.default);
app.use('/api/media', media_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: err,
    });
});
exports.default = app;
