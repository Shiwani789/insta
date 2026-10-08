import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class FeedService {
  async getFeed(userId: string, cursor?: string, limit = 20) {
    // A simple feed implementation: posts from users I follow + my own posts
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const userIds = [userId, ...following.map(f => f.followingId)];

    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: userIds },
        deletedAt: null
      },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, profilePhoto: true } },
        media: { orderBy: { order: 'asc' } },
        _count: { select: { likes: true, comments: true, saves: true } }
      }
    });

    let hasNextPage = false;
    let nextCursor = null;

    if (posts.length > limit) {
      hasNextPage = true;
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    // Attach isLiked/isSaved for the current user
    const postIds = posts.map(p => p.id);
    const [likes, saves] = await Promise.all([
      prisma.postLike.findMany({ where: { userId, postId: { in: postIds } } }),
      prisma.postSave.findMany({ where: { userId, postId: { in: postIds } } })
    ]);

    const likedPostIds = new Set(likes.map(l => l.postId));
    const savedPostIds = new Set(saves.map(s => s.postId));

    return {
      items: posts.map(p => ({
        ...p,
        likesCount: p._count.likes,
        commentsCount: p._count.comments,
        savesCount: p._count.saves,
        isLiked: likedPostIds.has(p.id),
        isSaved: savedPostIds.has(p.id),
        _count: undefined
      })),
      pagination: {
        nextCursor,
        hasMore: hasNextPage
      }
    };
  }
}

export const feedService = new FeedService();
