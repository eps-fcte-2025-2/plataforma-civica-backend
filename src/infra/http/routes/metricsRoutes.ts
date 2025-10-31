import { FastifyInstance } from 'fastify';
import { register } from '../../../config/metricsConfig';

/**
 * Rotas para expor métricas Prometheus
 */
export async function metricsRoutes(app: FastifyInstance) {
    // Endpoint para expor métricas no formato Prometheus
    app.get('/metrics', 
        {schema: {
            tags: ['Métricas']
        }},
        async (request, reply) => {
        reply.header('Content-Type', register.contentType);
        return register.metrics();
    });

    // Endpoint para health check
    app.get('/health', 
        {schema: {
            tags: ['Métricas']
        }},
        async (request, reply) => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    });
}
