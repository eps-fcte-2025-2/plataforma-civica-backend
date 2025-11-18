import { FastifyInstance } from 'fastify';
import z from 'zod';

import { FastifyTypedInstance } from '../../../../shared/types/types';
import { CreateReportController } from '../../controllers/CreateReportController';
import { GetReportByIdController } from '../../controllers/GetReportByIdController';
import { GetReportsController } from '../../controllers/GetReportsController';
import { UpdateReportStatusController } from '../../controllers/UpdateReportStatusController';
import { CreateReportSchema } from '../../dtos/CreateReportDTO';
import { GetReportsQuerySchemaDTO } from '../../dtos/GetReportsQuerySchemaDTO';
import {
  CreateReportResponseSchema,
  ReportResponseSchema,
  ReportsListResponseSchema,
} from '../../dtos/ReportResponseDTO';
import { UpdateReportStatusSchema } from '../../dtos/UpdateReportStatusDTO';

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
        params: null, // <-- ADICIONADO
        querystring: null, // <-- ADICIONADO
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
      schema: {
        tags: ['Reports'],
        summary: 'Listar denúncias com filtros',
        description:
          'Lista denúncias com filtros avançados e paginação. Endpoint protegido para backoffice.',
        body: null, // <-- ADICIONADO
        params: null, // <-- ADICIONADO
        querystring: GetReportsQuerySchemaDTO,
        response: {
          200: ReportsListResponseSchema,
        },
      },
    },
    (request, reply) => {
      new GetReportsController().handle(request, reply);
    }
  );

  // GET /v1/reports/:id - Visualizar denúncia completa
  app.get(
    '/:id',
    {
      schema: {
        tags: ['Reports'],
        summary: 'Visualizar denúncia completa',
        description:
          'Obtém todos os detalhes de uma denúncia específica, incluindo entidades relacionadas. Endpoint protegido.',
        body: null, // <-- ADICIONADO
        params: z.object({
          id: z.string().uuid('ID deve ser um UUID válido'),
        }),
        querystring: null, // <-- ADICIONADO
        response: {
          200: ReportResponseSchema,
        },
      },
    },
    (request, reply) => {
      new GetReportByIdController().handle(request, reply);
    }
  );

  // PATCH /v1/reports/:id - Atualizar status da denúncia
  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Reports'],
        summary: 'Atualizar status da denúncia',
        description:
          'Atualiza o status de uma denúncia específica. Endpoint protegido para backoffice.',
        body: UpdateReportStatusSchema,
        params: z.object({
          id: z.string().uuid('ID deve ser um UUID válido'),
        }),
        querystring: null, // <-- ADICIONADO
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    (request, reply) => {
      new UpdateReportStatusController().handle(request, reply);
    }
  );
}
