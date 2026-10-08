"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const database_1 = require("../../config/database");
const password_1 = require("../../common/utils/password");
const jwt_1 = require("../../common/utils/jwt");
const CustomError_1 = require("../../common/errors/CustomError");
class AuthService {
    async register(data) {
        const { username, password } = data;
        const emailOrPhone = String(data.email).trim();
        const isEmail = emailOrPhone.includes('@');
        const email = isEmail ? emailOrPhone : null;
        const phone = isEmail ? null : emailOrPhone;
        const nameParts = String(data.fullName ?? '').trim().split(/\s+/).filter(Boolean);
        const existingUser = await database_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : []),
                ]
            }
        });
        if (existingUser) {
            if (existingUser.username === username) {
                throw new CustomError_1.CustomError('Username already taken', 400);
            }
            if (existingUser.email === email) {
                throw new CustomError_1.CustomError('Email already registered', 400);
            }
            if (phone && existingUser.phone === phone) {
                throw new CustomError_1.CustomError('Phone number already registered', 400);
            }
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
            data: {
                username,
                email,
                phone,
                firstName: nameParts[0] ?? null,
                lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : null,
                passwordHash: hashedPassword,
            },
            // Return the same shape as login because the Flutter client stores the
            // access token and maps `data.user` after a successful registration.
        });
        const tokenPayload = { id: user.id, username: user.username };
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            accessToken: (0, jwt_1.generateAccessToken)(tokenPayload),
            refreshToken: (0, jwt_1.generateRefreshToken)(tokenPayload),
            user: userWithoutPassword,
        };
    }
    async login(data) {
        const { usernameOrEmail, password } = data;
        const user = await database_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                    { phone: usernameOrEmail },
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
