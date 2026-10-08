import { prisma } from '../../config/database';

export class ExploreService {
  async getExploreContent(cursor?: string, limit = 20) {
    // Basic ranking: order by likes count + comments count (using Prisma orderBy is complex for aggregates, so we will order by createdAt for now, or just random)
    // A production system would use an materialized view or an external ranking engine
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        author: { isPrivate: false, isActive: true, isBlocked: false }
      },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' }, // Or random if supported
      include: {
        author: { select: { id: true, username: true, profilePhoto: true } },
        media: { orderBy: { order: 'asc' } },
        _count: { select: { likes: true, comments: true } }
      }
    });

    let hasNextPage = false;
    let nextCursor = null;

    if (posts.length > limit) {
      hasNextPage = true;
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: posts,
      pagination: { nextCursor, hasMore: hasNextPage }
    };
  }
}

export const exploreService = new ExploreService();
