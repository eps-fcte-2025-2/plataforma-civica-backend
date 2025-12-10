import { FastifyInstance } from 'fastify';

/**
 * Plugin para logging estruturado de requisições HTTP
 * Registra: método, URL, status, tempo de resposta, user-agent, IP
 */
export async function requestLoggerPlugin(app: FastifyInstance) {
  // Hook executado antes de cada requisição
  app.addHook('onRequest', async (request, reply) => {
    request.log.info(
      {
        type: 'request',
        method: request.method,
        url: request.url,
        userAgent: request.headers['user-agent'],
        ip: request.ip,
      },
      'Incoming request'
    );
  });

  // Hook executado após cada resposta
  app.addHook('onResponse', async (request, reply) => {
    request.log.info(
      {
        type: 'response',
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
        userAgent: request.headers['user-agent'],
        ip: request.ip,
      },
      'Request completed'
    );
  });
}
