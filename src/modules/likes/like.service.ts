import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class LikeService {
  async likePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId, deletedAt: null } });
    if (!post) throw new CustomError('Post not found', 404);

    const like = await prisma.postLike.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId }
    });

    // Handle notifications (e.g. if like.createdAt is new)
    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          recipientId: post.authorId,
          actorId: userId,
          type: 'POST_LIKE',
          entityId: postId,
        }
      });
    }

    return { status: 'liked' };
  }

  async unlikePost(userId: string, postId: string) {
    await prisma.postLike.deleteMany({
      where: { userId, postId }
    });

    return { status: 'unliked' };
  }

  async getPostLikes(postId: string) {
    const likes = await prisma.postLike.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, username: true, profilePhoto: true }
        }
      }
    });

    return likes.map((l: any) => l.user);
  }
}

export const likeService = new LikeService();
