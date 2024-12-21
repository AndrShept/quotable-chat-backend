import { NextFunction, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AvatarGenerator } from 'random-avatar-generator';

export const ConversationController = {
  getConversations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await prisma.conversation.findMany({
        include: { messages: true },
      });
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  },
  getConversationById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res
        .status(404)
        .json({ success: false, message: 'conversationId not found' });
    }
    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },

        include: { messages: { include: { conversation: true } } },
      });
      const messages = conversation?.messages.sort(
        (a, b) =>
          new Date(b.createdAt).getDay() - new Date(a.createdAt).getDate()
      );
      res.status(200).json({
        ...conversation,
        messages,
      });
    } catch (error) {
      next(error);
    }
  },

  createConversation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { firstName, lastName } = req.body;
    const generator = new AvatarGenerator();
    const randomAvatarUrl = generator
      .generateRandomAvatar()
      .replace('Circle', 'Transparent');

    if (!firstName) {
      return res
        .status(404)
        .json({ success: false, message: 'firstName not found' });
    }

    try {
      const newConversation = await prisma.conversation.create({
        data: {
          firstName,
          lastName: lastName ? lastName : undefined,
          avatarUrl: randomAvatarUrl,
        },
      });
      res.status(201).json({
        success: true,
        message: 'Conversation created!',
        data: newConversation,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteConversations: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { conversationId } = req.params;
    console.log('conversationId', conversationId);
    try {
      await prisma.conversation.delete({
        where: {
          id: conversationId,
        },
      });
      res.status(200).json({
        success: true,
        message: 'Conversation deleted',
      });
    } catch (error) {
      next(error);
    }
  },
  updateConversations: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id, firstName, lastName } = req.body;

    try {
      await prisma.conversation.update({
        where: { id },
        data: { firstName, lastName },
      });
      res.status(200).json({
        success: true,
        message: 'Chat updated success',
      });
    } catch (error) {
      next(error);
    }
  },
};
