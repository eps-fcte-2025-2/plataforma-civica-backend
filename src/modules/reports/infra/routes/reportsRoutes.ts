import { FastifyTypedInstance } from '../../../../shared/types/types';
import { CreateReportSchema } from '../../dtos/CreateReportDTO';
import { CreateReportResponseSchema, ReportResponseSchema, ReportsListResponseSchema } from '../../dtos/ReportResponseDTO';
import { CreateReportController } from '../../controllers/CreateReportController';
import { GetReportByIdController } from '../../controllers/GetReportByIdController';
import { GetReportsController } from '../../controllers/GetReportsController';
import { GetReportsQuerySchemaDTO } from '../../dtos/GetReportsQuerySchemaDTO';
import { UpdateReportStatusController } from '../../controllers/UpdateReportStatusController';
import { UpdateReportStatusSchema } from '../../dtos/UpdateReportStatusDTO';
import { createAuthorizationMiddleware, UserRole } from '../../../../shared/middlewares/auth';
import z from 'zod';

export async function reportsRoutes(app: FastifyTypedInstance) {
  // POST /v1/reports - Criar nova denúncia
  app.post(
    '/',
    {
      schema: {
        tags: ['Reports'],
        summary: 'Criar nova denúncia',
        description:
          'Cria uma nova denúncia completa com todas as entidades relacionadas (pessoas, clubes, evidências, focos de manipulação).',
        body: CreateReportSchema,
        params: null,
        querystring: null,
        response: {
          200: CreateReportResponseSchema,
        },
      },
    },
    (request, reply) => {
      new CreateReportController().handle(request, reply);
    }
  );

  // GET /v1/reports - Listar denúncias
  app.get(
    '/',
    {
      preHandler: [createAuthorizationMiddleware(['ADMIN', 'SUPER_ADMIN', 'BACKOFFICE', 'MODERATOR'] as UserRole[])],
      schema: {
        tags: ['Reports'],
        summary: 'Listar denúncias com filtros',
        description:
          'Lista denúncias com filtros avançados e paginação. Endpoint protegido para backoffice.',
        security: [{ bearerAuth: [] }],
        body: null,
        params: null,
        querystring: GetReportsQuerySchemaDTO,
        response: {
          200: ReportsListResponseSchema,
          401: z.object({
            message: z.string(),
          }),
          403: z.object({
            message: z.string(),
          }),
        },
      },
    },
    (request, reply) => {
      new GetReportsController().handle(request, reply);
    }
  );

  app.get('/:id', {
    preHandler: [createAuthorizationMiddleware(['ADMIN', 'SUPER_ADMIN', 'BACKOFFICE', 'MODERATOR'] as UserRole[])],
    schema: {
      tags: ['Reports'],
      summary: 'Visualizar denúncia completa',
      description: 'Obtém todos os detalhes de uma denúncia específica, incluindo entidades relacionadas. Endpoint protegido para backoffice.',
      security: [{ bearerAuth: [] }],
      body: null,
      params: z.object({
        id: z.string().uuid('ID deve ser um UUID válido')
      }),
      querystring: null,
      response: {
        200: ReportResponseSchema,
        401: z.object({
          message: z.string(),
        }),
        403: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      }
    }
  }, (request, reply) => {
    new GetReportByIdController().handle(request, reply);
  });

  app.patch('/:id', {
    preHandler: [createAuthorizationMiddleware(['ADMIN', 'SUPER_ADMIN', 'MODERATOR'] as UserRole[])],
    schema: {
      tags: ['Reports'],
      summary: 'Atualizar status da denúncia',
      description: 'Atualiza o status de uma denúncia específica. Endpoint protegido para backoffice.',
      security: [{ bearerAuth: [] }],
      body: UpdateReportStatusSchema,
      params: z.object({
        id: z.string().uuid('ID deve ser um UUID válido')
      }),
      querystring: null,
      response: {
        200: z.object({
          message: z.string()
        }),
        401: z.object({
          message: z.string(),
        }),
        403: z.object({
          message: z.string(),
        }),
        404: z.object({
          message: z.string(),
        }),
      }
    }
  }, (request, reply) => {
    new UpdateReportStatusController().handle(request, reply);
  });
}
