"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileStory = exports.mobilePost = void 0;
const absoluteUrl = (value, baseUrl) => {
    if (!value)
        return value;
    if (/^https?:\/\//i.test(value))
        return value;
    return `${baseUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};
const mobilePost = (post, baseUrl) => ({
    ...post,
    author: post.author ? {
        ...post.author,
        fullName: post.author.fullName ?? ([post.author.firstName, post.author.lastName].filter(Boolean).join(' ') || post.author.username),
        avatar: absoluteUrl(post.author.profilePhoto, baseUrl) ?? null,
        profilePhoto: absoluteUrl(post.author.profilePhoto, baseUrl) ?? null,
    } : post.author,
    userId: post.authorId ?? post.author?.id,
    username: post.author?.username ?? 'unknown',
    userAvatar: absoluteUrl(post.author?.profilePhoto, baseUrl) ?? '',
    media: (post.media ?? []).map((item) => ({
        ...item,
        url: absoluteUrl(item.url, baseUrl),
    })),
    mediaUrls: (post.media ?? []).map((item) => absoluteUrl(item.url, baseUrl)),
});
exports.mobilePost = mobilePost;
const mobileStory = (story, baseUrl) => ({
    ...story,
    userId: story.userId ?? story.user?.id,
    username: story.user?.username ?? story.username ?? 'unknown',
    userAvatar: absoluteUrl(story.user?.profilePhoto ?? story.userAvatar, baseUrl) ?? '',
    mediaUrl: absoluteUrl(story.mediaUrl, baseUrl),
    isViewed: story.isViewed ?? false,
});
exports.mobileStory = mobileStory;
