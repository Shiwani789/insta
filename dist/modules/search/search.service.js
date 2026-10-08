"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchService = exports.SearchService = void 0;
const database_1 = require("../../config/database");
class SearchService {
    async search(query) {
        if (!query)
            return { users: [], hashtags: [], posts: [], reels: [] };
        // Search users
        const users = await database_1.prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } }
                ],
                isActive: true,
                isBlocked: false
            },
            select: { id: true, username: true, profilePhoto: true },
            take: 20
        });
        // Search hashtags
        const hashtags = await database_1.prisma.hashtag.findMany({
            where: { name: { contains: query.replace('#', ''), mode: 'insensitive' } },
            take: 20
        });
        // Search posts (caption)
        const posts = await database_1.prisma.post.findMany({
            where: {
                caption: { contains: query, mode: 'insensitive' },
                deletedAt: null,
                author: { isPrivate: false, isActive: true, isBlocked: false }
            },
            take: 20,
            include: {
                media: { take: 1 }
            }
        });
        // Search reels (caption)
        const reels = await database_1.prisma.reel.findMany({
            where: {
                caption: { contains: query, mode: 'insensitive' },
                author: { isPrivate: false, isActive: true, isBlocked: false }
            },
            take: 20
        });
        return {
            users,
            hashtags,
            posts,
            reels
        };
    }
}
exports.SearchService = SearchService;
exports.searchService = new SearchService();
