import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class SaveService {
  async savePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId, deletedAt: null } });
    if (!post) throw new CustomError('Post not found', 404);

    await prisma.postSave.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId }
    });

    return { status: 'saved' };
  }

  async unsavePost(userId: string, postId: string) {
    await prisma.postSave.deleteMany({
      where: { userId, postId }
    });

    return { status: 'unsaved' };
  }

  async getSavedPosts(userId: string) {
    const saves = await prisma.postSave.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: { select: { id: true, username: true, profilePhoto: true } },
            media: { orderBy: { order: 'asc' } }
          }
        }
      }
    });

    return saves.map((s: any) => s.post);
  }
}

export const saveService = new SaveService();
