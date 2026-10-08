import { prisma } from '../../config/database';
import { CustomError } from '../../common/errors/CustomError';

export class MessageService {
  async getConversations(userId: string) {
    const memberships = await prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: {
              where: { userId: { not: userId } },
              include: { user: { select: { id: true, username: true, profilePhoto: true } } }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { conversation: { updatedAt: 'desc' } }
    });

    return memberships.map(m => m.conversation);
  }

  async getConversationMessages(userId: string, conversationId: string, cursor?: string, limit = 20) {
    // Verify membership
    const member = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } }
    });
    if (!member) throw new CustomError('Unauthorized', 403);

    const messages = await prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, profilePhoto: true } },
        attachments: true,
        reactions: true,
        reads: true
      }
    });

    let hasNextPage = false;
    let nextCursor = null;

    if (messages.length > limit) {
      hasNextPage = true;
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: messages,
      pagination: { nextCursor, hasMore: hasNextPage }
    };
  }

  async sendMessage(userId: string, conversationId: string, data: any) {
    const { type, text, attachments } = data;

    const member = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } }
    });
    if (!member) throw new CustomError('Unauthorized', 403);

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        type: type || 'TEXT',
        text,
        ...(attachments && attachments.length > 0 && {
          attachments: {
            create: attachments.map((a: any) => ({ url: a.url, mimeType: a.mimeType }))
          }
        })
      },
      include: { attachments: true }
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // We will emit real-time events later via socket

    return message;
  }

  async createDirectConversation(userId: string, targetUserId: string) {
    if (userId === targetUserId) throw new CustomError('Cannot chat with yourself', 400);

    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            userId: { in: [userId, targetUserId] }
          }
        }
      },
      include: { members: true }
    });

    // Check strict length (2 members)
    if (existing && existing.members.length === 2) {
      return existing;
    }

    // Create new
    return prisma.conversation.create({
      data: {
        isGroup: false,
        members: {
          create: [{ userId }, { userId: targetUserId }]
        }
      },
      include: { members: true }
    });
  }
}

export const messageService = new MessageService();
