import { NextFunction, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { io } from '../app';
const quotable = require('quotable');

export const MessageController = {
  createMessage: async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId, content } = req.body;
    const aNewQuote = await quotable.getRandomQuote();

    const newMessage = await prisma.message.create({
      data: { content, sender: 'USER', conversationId },
      include: { conversation: true },
    });
    const newQuoteMessage = await prisma.message.create({
      data: { content: aNewQuote.content, sender: 'API', conversationId },
      include: { conversation: true },
    });
    console.log(newQuoteMessage);

    setTimeout(() => {
      io.emit('go', JSON.stringify(newQuoteMessage));
    }, 3300);

    try {
      res.status(201).json({
        success: true,
        message: 'message created!',
        data: newMessage,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMessage: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.message.delete({
        where: {
          id,
        },
      });
      res.status(200).json({
        success: true,
        message: 'Message deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};