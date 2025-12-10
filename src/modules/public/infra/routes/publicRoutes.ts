import { FastifyTypedInstance } from '../../../../shared/types/types';
import { GetDashboardMetricsController } from '../../controllers/GetDashboardMetricsController';
import { DashboardMetricsResponseSchema } from '../../dtos/DashboardMetricsDTO';
import { createAuthorizationMiddleware, UserRole } from '../../../../shared/middlewares/auth';
import z from 'zod';

export async function publicRoutes(app: FastifyTypedInstance) {
  // GET /v1/public/dashboard-metrics - Obter métricas públicas para o dashboard
  app.get(
    '/dashboard-metrics',
    {
      preHandler: [createAuthorizationMiddleware(['ADMIN', 'SUPER_ADMIN', 'BACKOFFICE', 'MODERATOR'] as UserRole[])],
      schema: {
        tags: ['Public'],
        summary: 'Obter métricas públicas do dashboard',
        description:
          'Retorna dados anonimizados e agregados para o dashboard público, incluindo estatísticas gerais e dados para mapas.',
        security: [{ bearerAuth: [] }],
        body: null,
        params: null,
        querystring: null,
        response: {
          200: DashboardMetricsResponseSchema,
          401: z.object({
            message: z.string(),
          }),
          403: z.object({
            message: z.string(),
          }),
        },
      },
    },
    new GetDashboardMetricsController().handle
  );
}
