import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class SettingsService {
  private async getOrCreateSettings(userId: string) {
    let settings = await prisma.userSettings.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.userSettings.create({ data: { userId } });
    }
    return settings;
  }

  // --- PRIVACY ---
  async getPrivacy(userId: string) {
    const settings = await this.getOrCreateSettings(userId);
    return { isPrivate: settings.isPrivate };
  }

  async updatePrivacy(userId: string, isPrivate: boolean) {
    return prisma.userSettings.update({
      where: { userId },
      data: { isPrivate }
    });
  }

  // --- STORY PRIVACY ---
  async getStoryPrivacy(userId: string) {
    const settings = await this.getOrCreateSettings(userId);
    return { storyPrivacy: settings.storyPrivacy };
  }

  async updateStoryPrivacy(userId: string, storyPrivacy: string) {
    return prisma.userSettings.update({
      where: { userId },
      data: { storyPrivacy }
    });
  }

  // --- COMMENTS, MENTIONS, TAGS, MESSAGES ---
  async updateInteractionSettings(userId: string, data: any) {
    // data can include allowComments, allowMentions, allowTags, manualTagApproval, messagePrivacy
    const allowedKeys = ['allowComments', 'allowMentions', 'allowTags', 'manualTagApproval', 'messagePrivacy'];
    const updateData: any = {};
    for (const key of allowedKeys) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    return prisma.userSettings.update({
      where: { userId },
      data: updateData
    });
  }

  // --- NOTIFICATIONS ---
  async updateNotificationSettings(userId: string, data: any) {
    return prisma.userSettings.update({
      where: { userId },
      data
    });
  }

  // --- BLOCKED / MUTED / RESTRICTED ---
  async getBlocked(userId: string) {
    return prisma.blockedUser.findMany({
      where: { blockerId: userId },
      include: { blocked: { select: { id: true, username: true, profilePhoto: true } } }
    });
  }

  async blockUser(userId: string, blockedId: string) {
    if (userId === blockedId) throw new CustomError('Cannot block yourself', 400);
    
    // Blocking means we must unfollow each other
    await prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: userId, followingId: blockedId },
          { followerId: blockedId, followingId: userId }
        ]
      }
    });

    return prisma.blockedUser.upsert({
      where: { blockerId_blockedId: { blockerId: userId, blockedId } },
      update: {},
      create: { blockerId: userId, blockedId }
    });
  }

  async unblockUser(userId: string, blockedId: string) {
    await prisma.blockedUser.deleteMany({
      where: { blockerId: userId, blockedId }
    });
    return { success: true };
  }
  
  async muteUser(userId: string, mutedId: string, options: any) {
    if (userId === mutedId) throw new CustomError('Cannot mute yourself', 400);
    return prisma.mutedUser.upsert({
      where: { muterId_mutedId: { muterId: userId, mutedId } },
      update: options,
      create: { muterId: userId, mutedId, ...options }
    });
  }
  
  async unmuteUser(userId: string, mutedId: string) {
    await prisma.mutedUser.deleteMany({
      where: { muterId: userId, mutedId }
    });
    return { success: true };
  }

  // --- ACCOUNT EXPORT ---
  async requestDataExport(userId: string) {
    // In a real app, dispatch to BullMQ worker to generate zip
    return prisma.dataExportRequest.create({
      data: { userId, status: 'PENDING' }
    });
  }

  // --- ACCOUNT DEACTIVATION / DELETION ---
  async deactivateAccount(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });
  }

  async deleteAccount(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false }
    });
  }
}

export const settingsService = new SettingsService();
