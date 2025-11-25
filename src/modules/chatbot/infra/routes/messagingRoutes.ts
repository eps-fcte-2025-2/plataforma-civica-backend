import { FastifyInstance } from 'fastify';

import { MessageController } from '../../controllers/MessageController';

export async function messageRoutes(app: FastifyInstance) {
  const messageController = new MessageController();

  // Rota de verificação (GET)
  app.get('/webhook', messageController.verify.bind(messageController));

  // Rota de recebimento (POST)
  app.post('/webhook', messageController.handle.bind(messageController));
}