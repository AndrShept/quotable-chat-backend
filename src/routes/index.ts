import express from 'express';
import { ConversationController } from '../controllers/conversation-controller';
import { MessageController } from '../controllers/message-controller';

export const routes = express.Router();

routes.get('/conversations', ConversationController.getConversations);
routes.get(
  '/conversations/:conversationId',
  ConversationController.getConversationById
);

routes.post('/conversations', ConversationController.createConversation);

routes.delete(
  '/conversations/:conversationId',
  ConversationController.deleteConversations
);
routes.put('/conversations', ConversationController.updateConversations);



routes.post('/messages', MessageController.createMessage);
routes.delete('/messages/:id', MessageController.deleteMessage);
