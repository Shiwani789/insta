"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class PostService {
    async createPost(userId, data) {
        const { caption, location, media, hashtags } = data;
        // Use a transaction to ensure all related records are created safely
        const post = await database_1.prisma.$transaction(async (prismaClient) => {
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
                const mediaData = media.map((item, index) => ({
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
    async getPostById(postId, requestingUserId) {
        const post = await database_1.prisma.post.findUnique({
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
        if (!post)
            throw new CustomError_1.CustomError('Post not found', 404);
        let isLiked = false;
        let isSaved = false;
        if (requestingUserId) {
            const like = await database_1.prisma.postLike.findUnique({
                where: { userId_postId: { userId: requestingUserId, postId } }
            });
            isLiked = !!like;
            const save = await database_1.prisma.postSave.findUnique({
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
    async deletePost(postId, userId) {
        const post = await database_1.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new CustomError_1.CustomError('Post not found', 404);
        if (post.authorId !== userId)
            throw new CustomError_1.CustomError('Unauthorized', 403);
        await database_1.prisma.post.update({
            where: { id: postId },
            data: { deletedAt: new Date() }
        });
        return { success: true };
    }
}
exports.PostService = PostService;
exports.postService = new PostService();
