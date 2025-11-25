import { FastifyReply, FastifyRequest } from 'fastify';

import { VerifyWebhookQuerySchema, WebhookMessageBodySchema } from '../dtos/MessageRequestDTO';
import { makeProcessMessageUseCase } from '../factories/ProcessMessageFactory';

export class MessageController {
  
  // GET: Validação do Webhook (Exigência da Meta)
  async verify(request: FastifyRequest, reply: FastifyReply) {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = 
      VerifyWebhookQuerySchema.parse(request.query);

    const envVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === envVerifyToken) {
      return reply.code(200).send(challenge);
    }

    return reply.code(403).send('Forbidden');
  }
  
  // POST: Recebimento de Mensagens
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // 1. Validar payload com Zod (DTO)
    const payload = WebhookMessageBodySchema.parse(request.body);

    // 2. Extrair dados úteis (Isso poderia estar num helper/mapper)
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    
    if (value?.messages && value.messages.length > 0) {
      const message = value.messages[0];
      
      // Se for texto, invoca o UseCase via Factory
      if (message.type === 'text' && message.text) {
        const processMessageUseCase = makeProcessMessageUseCase();
        
        // Não usamos await aqui propositalmente para liberar o webhook rápido (Fire and Forget)
        processMessageUseCase.execute(message.from, message.text.body);
      }
    }

    return reply.code(200).send('EVENT_RECEIVED');
  }
}