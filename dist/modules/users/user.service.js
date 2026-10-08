"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class UserService {
    async getProfileData(user, requestingUserId) {
        let isFollowing = false;
        let isFollowedBy = false;
        let isBlocked = false;
        let isMuted = false;
        let isRestricted = false;
        if (requestingUserId && requestingUserId !== user.id) {
            const [follow, followedBy, blocked, muted, restricted] = await Promise.all([
                database_1.prisma.follow.findUnique({ where: { followerId_followingId: { followerId: requestingUserId, followingId: user.id } } }),
                database_1.prisma.follow.findUnique({ where: { followerId_followingId: { followerId: user.id, followingId: requestingUserId } } }),
                database_1.prisma.blockedUser.findUnique({ where: { blockerId_blockedId: { blockerId: requestingUserId, blockedId: user.id } } }),
                database_1.prisma.mutedUser.findUnique({ where: { muterId_mutedId: { muterId: requestingUserId, mutedId: user.id } } }),
                database_1.prisma.restrictedUser.findUnique({ where: { restricterId_restrictedId: { restricterId: requestingUserId, restrictedId: user.id } } })
            ]);
            isFollowing = !!follow;
            isFollowedBy = !!followedBy;
            isBlocked = !!blocked;
            isMuted = !!muted;
            isRestricted = !!restricted;
        }
        const { passwordHash, ...safeUser } = user;
        return {
            ...safeUser,
            followersCount: user._count.followers,
            followingCount: user._count.following,
            postsCount: user._count.posts,
            reelsCount: user._count.reels,
            isFollowing,
            isFollowedBy,
            isBlocked,
            isMuted,
            isRestricted,
            _count: undefined
        };
    }
    async getUserByUsername(username, requestingUserId) {
        const user = await database_1.prisma.user.findUnique({
            where: { username, isActive: true, isBlocked: false },
            include: {
                _count: { select: { followers: true, following: true, posts: true, reels: true } }
            }
        });
        if (!user)
            throw new CustomError_1.CustomError('User not found', 404);
        return this.getProfileData(user, requestingUserId);
    }
    async getUserById(id, requestingUserId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id, isActive: true, isBlocked: false },
            include: {
                _count: { select: { followers: true, following: true, posts: true, reels: true } }
            }
        });
        if (!user)
            throw new CustomError_1.CustomError('User not found', 404);
        return this.getProfileData(user, requestingUserId);
    }
    async updateProfile(userId, data) {
        if (data.username) {
            data.username = data.username.toLowerCase();
            const existing = await database_1.prisma.user.findUnique({ where: { username: data.username } });
            if (existing && existing.id !== userId) {
                throw new CustomError_1.CustomError('Username is already taken', 400);
            }
            const usernameRegex = /^[a-z0-9_.]+$/;
            if (!usernameRegex.test(data.username)) {
                throw new CustomError_1.CustomError('Username can only contain letters, numbers, underscores, and periods', 400);
            }
            if (data.username.length < 3 || data.username.length > 30) {
                throw new CustomError_1.CustomError('Username must be between 3 and 30 characters', 400);
            }
        }
        const user = await database_1.prisma.user.update({
            where: { id: userId },
            data,
        });
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
    async updateProfilePhoto(userId, profilePhotoUrl) {
        const user = await database_1.prisma.user.update({
            where: { id: userId },
            data: { profilePhoto: profilePhotoUrl },
        });
        return { profilePhoto: user.profilePhoto };
    }
    async deleteProfilePhoto(userId) {
        await database_1.prisma.user.update({
            where: { id: userId },
            data: { profilePhoto: null },
        });
        return { success: true };
    }
    async getUserPosts(userId, cursor, limit = 12) {
        const posts = await database_1.prisma.post.findMany({
            where: { authorId: userId, deletedAt: null },
            take: limit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'desc' },
            include: { media: { orderBy: { order: 'asc' } }, _count: { select: { likes: true, comments: true } } }
        });
        let hasNextPage = false;
        let nextCursor = null;
        if (posts.length > limit) {
            hasNextPage = true;
            const nextItem = posts.pop();
            nextCursor = nextItem?.id;
        }
        return { items: posts, pagination: { nextCursor, hasMore: hasNextPage } };
    }
    async getUserReels(userId, cursor, limit = 12) {
        const reels = await database_1.prisma.reel.findMany({
            where: { authorId: userId },
            take: limit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { likes: true, comments: true } } }
        });
        let hasNextPage = false;
        let nextCursor = null;
        if (reels.length > limit) {
            hasNextPage = true;
            const nextItem = reels.pop();
            nextCursor = nextItem?.id;
        }
        return { items: reels, pagination: { nextCursor, hasMore: hasNextPage } };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
