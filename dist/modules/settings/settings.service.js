"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = exports.SettingsService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class SettingsService {
    async getOrCreateSettings(userId) {
        let settings = await database_1.prisma.userSettings.findUnique({ where: { userId } });
        if (!settings) {
            settings = await database_1.prisma.userSettings.create({ data: { userId } });
        }
        return settings;
    }
    // --- PRIVACY ---
    async getPrivacy(userId) {
        const settings = await this.getOrCreateSettings(userId);
        return { isPrivate: settings.isPrivate };
    }
    async updatePrivacy(userId, isPrivate) {
        return database_1.prisma.userSettings.update({
            where: { userId },
            data: { isPrivate }
        });
    }
    // --- STORY PRIVACY ---
    async getStoryPrivacy(userId) {
        const settings = await this.getOrCreateSettings(userId);
        return { storyPrivacy: settings.storyPrivacy };
    }
    async updateStoryPrivacy(userId, storyPrivacy) {
        return database_1.prisma.userSettings.update({
            where: { userId },
            data: { storyPrivacy }
        });
    }
    // --- COMMENTS, MENTIONS, TAGS, MESSAGES ---
    async updateInteractionSettings(userId, data) {
        // data can include allowComments, allowMentions, allowTags, manualTagApproval, messagePrivacy
        const allowedKeys = ['allowComments', 'allowMentions', 'allowTags', 'manualTagApproval', 'messagePrivacy'];
        const updateData = {};
        for (const key of allowedKeys) {
            if (data[key] !== undefined)
                updateData[key] = data[key];
        }
        return database_1.prisma.userSettings.update({
            where: { userId },
            data: updateData
        });
    }
    // --- NOTIFICATIONS ---
    async updateNotificationSettings(userId, data) {
        return database_1.prisma.userSettings.update({
            where: { userId },
            data
        });
    }
    // --- BLOCKED / MUTED / RESTRICTED ---
    async getBlocked(userId) {
        return database_1.prisma.blockedUser.findMany({
            where: { blockerId: userId },
            include: { blocked: { select: { id: true, username: true, profilePhoto: true } } }
        });
    }
    async blockUser(userId, blockedId) {
        if (userId === blockedId)
            throw new CustomError_1.CustomError('Cannot block yourself', 400);
        // Blocking means we must unfollow each other
        await database_1.prisma.follow.deleteMany({
            where: {
                OR: [
                    { followerId: userId, followingId: blockedId },
                    { followerId: blockedId, followingId: userId }
                ]
            }
        });
        return database_1.prisma.blockedUser.upsert({
            where: { blockerId_blockedId: { blockerId: userId, blockedId } },
            update: {},
            create: { blockerId: userId, blockedId }
        });
    }
    async unblockUser(userId, blockedId) {
        await database_1.prisma.blockedUser.deleteMany({
            where: { blockerId: userId, blockedId }
        });
        return { success: true };
    }
    async muteUser(userId, mutedId, options) {
        if (userId === mutedId)
            throw new CustomError_1.CustomError('Cannot mute yourself', 400);
        return database_1.prisma.mutedUser.upsert({
            where: { muterId_mutedId: { muterId: userId, mutedId } },
            update: options,
            create: { muterId: userId, mutedId, ...options }
        });
    }
    async unmuteUser(userId, mutedId) {
        await database_1.prisma.mutedUser.deleteMany({
            where: { muterId: userId, mutedId }
        });
        return { success: true };
    }
    // --- ACCOUNT EXPORT ---
    async requestDataExport(userId) {
        // In a real app, dispatch to BullMQ worker to generate zip
        return database_1.prisma.dataExportRequest.create({
            data: { userId, status: 'PENDING' }
        });
    }
    // --- ACCOUNT DEACTIVATION / DELETION ---
    async deactivateAccount(userId) {
        return database_1.prisma.user.update({
            where: { id: userId },
            data: { isActive: false }
        });
    }
    async deleteAccount(userId) {
        return database_1.prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), isActive: false }
        });
    }
}
exports.SettingsService = SettingsService;
exports.settingsService = new SettingsService();
