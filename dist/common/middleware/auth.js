"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = require("../../config/database");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, isActive: true, isBlocked: true },
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account deactivated' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: 'Account blocked' });
        }
        req.user = {
            id: user.id,
            username: user.username,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
