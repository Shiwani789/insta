import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class StoryService {
  async createStory(userId: string, data: any) {
    const { mediaUrl, mediaType, caption } = data;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiration

    const story = await prisma.story.create({
      data: {
        userId,
        mediaUrl,
        mediaType,
        caption,
        expiresAt
      }
    });

    return story;
  }

  async getStories(userId: string) {
    // Get stories of followings and own stories, active only
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const userIds = [userId, ...following.map(f => f.followingId)];

    const stories = await prisma.story.findMany({
      where: {
        userId: { in: userIds },
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, username: true, profilePhoto: true } }
      }
    });

    // The Flutter client consumes a flat list of story objects.
    return stories.map((story: any) => ({
      ...story,
      username: story.user.username,
      userAvatar: story.user.profilePhoto,
      isViewed: false,
      user: undefined,
    }));
  }

  async viewStory(userId: string, storyId: string) {
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new CustomError('Story not found', 404);

    if (story.userId !== userId) {
      await prisma.storyView.upsert({
        where: { storyId_viewerId: { storyId, viewerId: userId } },
        update: { viewedAt: new Date() },
        create: { storyId, viewerId: userId }
      });
      // Story view notification could be grouped or muted depending on volume
    }

    return { success: true };
  }

  async reactToStory(userId: string, storyId: string, type: string) {
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new CustomError('Story not found', 404);

    // Send a real-time message or notification
    await prisma.notification.create({
      data: {
        recipientId: story.userId,
        actorId: userId,
        type: 'STORY_REACTION',
        entityId: storyId,
        message: type // 'LIKE', 'LOVE', etc.
      }
    });

    return { success: true };
  }

  async deleteStory(userId: string, storyId: string) {
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new CustomError('Story not found', 404);
    if (story.userId !== userId) throw new CustomError('Unauthorized', 403);

    await prisma.story.delete({ where: { id: storyId } });
    return { success: true };
  }
}

export const storyService = new StoryService();
