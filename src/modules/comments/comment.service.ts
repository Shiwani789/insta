import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class CommentService {
  async createComment(userId: string, postId: string, text: string, parentCommentId?: string) {
    const post = await prisma.post.findUnique({ where: { id: postId, deletedAt: null } });
    if (!post) throw new CustomError('Post not found', 404);

    if (parentCommentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentCommentId } });
      if (!parent || parent.postId !== postId) {
        throw new CustomError('Invalid parent comment', 400);
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        text,
        parentCommentId
      },
      include: {
        user: { select: { id: true, username: true, profilePhoto: true } }
      }
    });

    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          recipientId: post.authorId,
          actorId: userId,
          type: 'POST_COMMENT',
          entityId: comment.id,
          message: text.substring(0, 50)
        }
      });
    }

    return comment;
  }

  async getComments(postId: string, cursor?: string, limit = 20) {
    const comments = await prisma.comment.findMany({
      where: { postId, parentCommentId: null },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, profilePhoto: true } },
        _count: { select: { replies: true, likes: true } }
      }
    });

    let hasNextPage = false;
    let nextCursor = null;

    if (comments.length > limit) {
      hasNextPage = true;
      const nextItem = comments.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: comments.map(c => ({
        ...c,
        repliesCount: c._count.replies,
        likesCount: c._count.likes,
        _count: undefined
      })),
      pagination: {
        nextCursor,
        hasMore: hasNextPage
      }
    };
  }

  async updateComment(userId: string, commentId: string, text: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new CustomError('Comment not found', 404);
    if (comment.userId !== userId) throw new CustomError('Unauthorized', 403);

    return prisma.comment.update({
      where: { id: commentId },
      data: { text }
    });
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: { select: { authorId: true } } }
    });
    
    if (!comment) throw new CustomError('Comment not found', 404);

    // The author of the post or the author of the comment can delete it
    if (comment.userId !== userId && comment.post.authorId !== userId) {
      throw new CustomError('Unauthorized', 403);
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }

  async likeComment(userId: string, commentId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new CustomError('Comment not found', 404);

    await prisma.commentLike.upsert({
      where: { userId_commentId: { userId, commentId } },
      update: {},
      create: { userId, commentId }
    });

    if (comment.userId !== userId) {
      await prisma.notification.create({
        data: {
          recipientId: comment.userId,
          actorId: userId,
          type: 'COMMENT_LIKE',
          entityId: commentId,
        }
      });
    }

    return { status: 'liked' };
  }

  async unlikeComment(userId: string, commentId: string) {
    await prisma.commentLike.deleteMany({
      where: { userId, commentId }
    });
    return { status: 'unliked' };
  }
}

export const commentService = new CommentService();
