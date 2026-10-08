import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class PostService {
  async createPost(userId: string, data: any) {
    const { caption, location, media, hashtags } = data;

    // Use a transaction to ensure all related records are created safely
    const post = await prisma.$transaction(async (prismaClient) => {
      // 1. Create the Post
      const newPost = await prismaClient.post.create({
        data: {
          authorId: userId,
          caption,
          location,
        }
      });

      // 2. Create PostMedia
      if (media && media.length > 0) {
        const mediaData = media.map((item: any, index: number) => ({
          postId: newPost.id,
          url: item.url,
          mimeType: item.mimeType,
          size: item.size,
          width: item.width,
          height: item.height,
          duration: item.duration,
          order: index,
        }));
        await prismaClient.postMedia.createMany({ data: mediaData });
      }

      // 3. Handle Hashtags
      if (hashtags && hashtags.length > 0) {
        for (const tag of hashtags) {
          const tagName = tag.toLowerCase().replace('#', '');
          
          // Upsert hashtag
          const hashtagRecord = await prismaClient.hashtag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName }
          });

          // Link to post
          await prismaClient.postHashtag.create({
            data: {
              postId: newPost.id,
              hashtagId: hashtagRecord.id
            }
          });
        }
      }

      return newPost;
    });

    return this.getPostById(post.id, userId);
  }

  async getPostById(postId: string, requestingUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId, deletedAt: null },
      include: {
        author: {
          select: { id: true, username: true, profilePhoto: true, isPrivate: true }
        },
        media: { orderBy: { order: 'asc' } },
        _count: {
          select: { likes: true, comments: true, saves: true }
        }
      }
    });

    if (!post) throw new CustomError('Post not found', 404);

    let isLiked = false;
    let isSaved = false;

    if (requestingUserId) {
      const like = await prisma.postLike.findUnique({
        where: { userId_postId: { userId: requestingUserId, postId } }
      });
      isLiked = !!like;

      const save = await prisma.postSave.findUnique({
        where: { userId_postId: { userId: requestingUserId, postId } }
      });
      isSaved = !!save;
    }

    return {
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      savesCount: post._count.saves,
      isLiked,
      isSaved,
      _count: undefined // remove the internal count object
    };
  }

  async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new CustomError('Post not found', 404);
    if (post.authorId !== userId) throw new CustomError('Unauthorized', 403);

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() }
    });

    return { success: true };
  }
}

export const postService = new PostService();
