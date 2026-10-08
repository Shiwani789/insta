"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followService = exports.FollowService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class FollowService {
    async follow(followerId, followingId) {
        if (followerId === followingId) {
            throw new CustomError_1.CustomError('Cannot follow yourself', 400);
        }
        const targetUser = await database_1.prisma.user.findUnique({
            where: { id: followingId, isActive: true, isBlocked: false }
        });
        if (!targetUser)
            throw new CustomError_1.CustomError('User not found', 404);
        if (targetUser.isPrivate) {
            // Create follow request
            const request = await database_1.prisma.followRequest.upsert({
                where: { senderId_receiverId: { senderId: followerId, receiverId: followingId } },
                update: {},
                create: { senderId: followerId, receiverId: followingId }
            });
            // Optionally create notification here
            return { status: 'requested' };
        }
        else {
            // Create follow relationship directly
            await database_1.prisma.follow.upsert({
                where: { followerId_followingId: { followerId, followingId } },
                update: {},
                create: { followerId, followingId }
            });
            // Optionally create notification here
            return { status: 'following' };
        }
    }
    async unfollow(followerId, followingId) {
        await database_1.prisma.follow.deleteMany({
            where: { followerId, followingId }
        });
        return { status: 'unfollowed' };
    }
    async acceptRequest(receiverId, requestId) {
        const request = await database_1.prisma.followRequest.findUnique({
            where: { id: requestId }
        });
        if (!request || request.receiverId !== receiverId) {
            throw new CustomError_1.CustomError('Request not found', 404);
        }
        await database_1.prisma.$transaction([
            database_1.prisma.follow.upsert({
                where: { followerId_followingId: { followerId: request.senderId, followingId: receiverId } },
                update: {},
                create: { followerId: request.senderId, followingId: receiverId }
            }),
            database_1.prisma.followRequest.delete({ where: { id: requestId } })
        ]);
        return { success: true };
    }
    async rejectRequest(receiverId, requestId) {
        const request = await database_1.prisma.followRequest.findUnique({
            where: { id: requestId }
        });
        if (!request || request.receiverId !== receiverId) {
            throw new CustomError_1.CustomError('Request not found', 404);
        }
        await database_1.prisma.followRequest.delete({ where: { id: requestId } });
        return { success: true };
    }
}
exports.FollowService = FollowService;
exports.followService = new FollowService();
