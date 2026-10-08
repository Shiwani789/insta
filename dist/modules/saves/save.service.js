"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveService = exports.SaveService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class SaveService {
    async savePost(userId, postId) {
        const post = await database_1.prisma.post.findUnique({ where: { id: postId, deletedAt: null } });
        if (!post)
            throw new CustomError_1.CustomError('Post not found', 404);
        await database_1.prisma.postSave.upsert({
            where: { userId_postId: { userId, postId } },
            update: {},
            create: { userId, postId }
        });
        return { status: 'saved' };
    }
    async unsavePost(userId, postId) {
        await database_1.prisma.postSave.deleteMany({
            where: { userId, postId }
        });
        return { status: 'unsaved' };
    }
    async getSavedPosts(userId) {
        const saves = await database_1.prisma.postSave.findMany({
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
        return saves.map((s) => s.post);
    }
}
exports.SaveService = SaveService;
exports.saveService = new SaveService();
