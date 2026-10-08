"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const database_1 = require("../../config/database");
const password_1 = require("../../common/utils/password");
const jwt_1 = require("../../common/utils/jwt");
const CustomError_1 = require("../../common/errors/CustomError");
class AuthService {
    async register(data) {
        const { username, email, password } = data;
        const existingUser = await database_1.prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });
        if (existingUser) {
            if (existingUser.username === username) {
                throw new CustomError_1.CustomError('Username already taken', 400);
            }
            if (existingUser.email === email) {
                throw new CustomError_1.CustomError('Email already registered', 400);
            }
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            }
        });
        return user;
    }
    async login(data) {
        const { usernameOrEmail, password } = data;
        const user = await database_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
            }
        });
        if (!user) {
            throw new CustomError_1.CustomError('Invalid credentials', 401);
        }
        if (!user.isActive) {
            throw new CustomError_1.CustomError('Account deactivated', 403);
        }
        if (user.isBlocked) {
            throw new CustomError_1.CustomError('Account blocked', 403);
        }
        const isMatch = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isMatch) {
            throw new CustomError_1.CustomError('Invalid credentials', 401);
        }
        const tokenPayload = { id: user.id, username: user.username };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        // In a real application, you might want to save the refreshToken in the database to allow revoking
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            accessToken,
            refreshToken,
            user: userWithoutPassword
        };
    }
    async refreshToken(token) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.id }
            });
            if (!user || !user.isActive || user.isBlocked) {
                throw new CustomError_1.CustomError('Invalid or expired refresh token', 401);
            }
            const tokenPayload = { id: user.id, username: user.username };
            const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
            const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
            return {
                accessToken,
                refreshToken
            };
        }
        catch (error) {
            throw new CustomError_1.CustomError('Invalid or expired refresh token', 401);
        }
    }
    async logout(userId) {
        // If refresh tokens are saved in the DB, this is where you would delete/invalidate it.
        return { success: true };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
