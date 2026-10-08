import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class FollowService {
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new CustomError('Cannot follow yourself', 400);
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: followingId, isActive: true, isBlocked: false }
    });

    if (!targetUser) throw new CustomError('User not found', 404);

    if (targetUser.isPrivate) {
      // Create follow request
      const request = await prisma.followRequest.upsert({
        where: { senderId_receiverId: { senderId: followerId, receiverId: followingId } },
        update: {},
        create: { senderId: followerId, receiverId: followingId }
      });
      // Optionally create notification here
      return { status: 'requested' };
    } else {
      // Create follow relationship directly
      await prisma.follow.upsert({
        where: { followerId_followingId: { followerId, followingId } },
        update: {},
        create: { followerId, followingId }
      });
      // Optionally create notification here
      return { status: 'following' };
    }
  }

  async unfollow(followerId: string, followingId: string) {
    await prisma.follow.deleteMany({
      where: { followerId, followingId }
    });
    return { status: 'unfollowed' };
  }

  async acceptRequest(receiverId: string, requestId: string) {
    const request = await prisma.followRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.receiverId !== receiverId) {
      throw new CustomError('Request not found', 404);
    }

    await prisma.$transaction([
      prisma.follow.upsert({
        where: { followerId_followingId: { followerId: request.senderId, followingId: receiverId } },
        update: {},
        create: { followerId: request.senderId, followingId: receiverId }
      }),
      prisma.followRequest.delete({ where: { id: requestId } })
    ]);

    return { success: true };
  }

  async rejectRequest(receiverId: string, requestId: string) {
    const request = await prisma.followRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.receiverId !== receiverId) {
      throw new CustomError('Request not found', 404);
    }

    await prisma.followRequest.delete({ where: { id: requestId } });
    return { success: true };
  }
}

export const followService = new FollowService();
