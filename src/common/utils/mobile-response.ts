const absoluteUrl = (value: string | null | undefined, baseUrl: string) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};

export const mobilePost = (post: any, baseUrl: string) => ({
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
  media: (post.media ?? []).map((item: any) => ({
    ...item,
    url: absoluteUrl(item.url, baseUrl),
  })),
  mediaUrls: (post.media ?? []).map((item: any) => absoluteUrl(item.url, baseUrl)),
});

export const mobileStory = (story: any, baseUrl: string) => ({
  ...story,
  userId: story.userId ?? story.user?.id,
  username: story.user?.username ?? story.username ?? 'unknown',
  userAvatar: absoluteUrl(story.user?.profilePhoto ?? story.userAvatar, baseUrl) ?? '',
  mediaUrl: absoluteUrl(story.mediaUrl, baseUrl),
  isViewed: story.isViewed ?? false,
});
