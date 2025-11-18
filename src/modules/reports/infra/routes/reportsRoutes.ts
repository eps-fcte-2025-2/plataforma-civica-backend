import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../../../shared/middlewares/auth";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FastifyTypedInstance } from "../../../../shared/types/types";
import { CreateReportSchema } from "../../dtos/CreateReportDTO";
import { CreateReportResponseSchema, ReportResponseSchema, ReportsListResponseSchema } from "../../dtos/ReportResponseDTO";
import { CreateReportController } from "../../controllers/CreateReportController";
import { GetReportByIdController } from "../../controllers/GetReportByIdController";
import { GetReportsController } from "../../controllers/GetReportsController";
import { GetReportsQuerySchemaDTO } from "../../dtos/GetReportsQuerySchemaDTO";
import { UpdateReportStatusController } from "../../controllers/UpdateReportStatusController";
import { UpdateReportStatusSchema } from "../../dtos/UpdateReportStatusDTO";
import z from "zod";
import { verifyJWT, createAuthorizationMiddleware, UserRole } from "../../../../shared/middlewares/auth";

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
    app.get("/:id", {
        preHandler: [createAuthorizationMiddleware(['ADMIN', 'SUPER_ADMIN', 'BACKOFFICE'] as UserRole[])],
        schema: {
            tags: ["Reports"],
            summary: "Visualizar denúncia completa",
            description: "Obtém todos os detalhes de uma denúncia específica, incluindo entidades relacionadas. Endpoint protegido para ADMIN, SUPER_ADMIN ou BACKOFFICE.",
            body: null, // <-- ADICIONADO
            params: z.object({
                id: z.string().uuid("ID deve ser um UUID válido")
            }),
            querystring: null, // <-- ADICIONADO
            response: {
                200: ReportResponseSchema
            }
        }
    }, (request, reply) => {
        new GetReportByIdController().handle(request, reply);
    });

    const authMiddleware = new AuthenticationMiddleware();
    const authorizationMiddleware = new AuthorizationMiddleware();

    // PATCH /v1/reports/:id - Atualizar status da denúncia
    app.patch("/:id", {
        preHandler: [
            (request, reply) => authMiddleware.handle(request, reply),
            authorizationMiddleware.requireRole(['ADMIN', 'MODERATOR', 'SUPER_ADMIN'])
        ],
        schema: {
            tags: ["Reports"],
            summary: "Atualizar status da denúncia",
            description: "Atualiza o status de uma denúncia específica. Endpoint protegido para backoffice.",
            body: UpdateReportStatusSchema,
            params: z.object({
                id: z.string().uuid("ID deve ser um UUID válido")
            }),
            querystring: null, // <-- ADICIONADO
            response: {
                200: z.object({
                    message: z.string()
                })
            }
        }
    }, (request, reply) => {
        new UpdateReportStatusController().handle(request, reply);
    });
}
