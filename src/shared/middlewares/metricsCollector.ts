import { FastifyInstance } from 'fastify';

import {
  httpErrorCounter,
  httpRequestCounter,
  httpRequestDuration,
  httpRequestsInProgress,
} from '../../config/metricsConfig';

/**
 * Plugin para coletar métricas Prometheus
 * Monitora: latência, taxa de erros, requisições em andamento
 */
export async function metricsCollectorPlugin(app: FastifyInstance) {
  // Hook executado antes de cada requisição
  app.addHook('onRequest', async (request, reply) => {
    // Incrementa requisições em andamento
    httpRequestsInProgress.inc({ method: request.method });

    // Armazena o tempo de início no contexto da requisição
    (request as any).startTime = Date.now();
  });

  // Hook executado após cada resposta
  app.addHook('onResponse', async (request, reply) => {
    // Decrementa requisições em andamento
    httpRequestsInProgress.dec({ method: request.method });

    const route = request.routeOptions?.url || request.url;
    const method = request.method;
    const statusCode = reply.statusCode.toString();

    // Calcula a duração da requisição em segundos
    const startTime = (request as any).startTime || Date.now();
    const duration = (Date.now() - startTime) / 1000;

    // Registra métricas
    httpRequestCounter.inc({ method, route, status_code: statusCode });
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);

    // Registra erros (status >= 400)
    if (reply.statusCode >= 400) {
      httpErrorCounter.inc({ method, route, status_code: statusCode });
    }
  });
}
