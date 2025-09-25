import { FastifyInstance } from "fastify";
import z from "zod";
import { PaginateQuerySchema } from "../../../../shared/dtos/PaginationSchema";
import { FastifyTypedInstance } from "../../../../shared/types/types";
import { CreateReportSchema } from "../../dtos/CreateReportDTO";
import { CreateReportResponseSchema, ReportResponseSchema, ReportsListResponseSchema } from "../../dtos/ReportResponseDTO";
import { UpdateReportStatusSchema } from "../../dtos/UpdateReportStatusDTO";
import { CreateReportController } from "../../controllers/CreateReportController";
import { GetReportByIdController } from "../../controllers/GetReportByIdController";
import { GetReportsController } from "../../controllers/GetReportsController";
import { UpdateReportStatusController } from "../../controllers/UpdateReportStatusController";
import { GetReportsQuerySchemaDTO } from "../../dtos/GetReportsQuerySchemaDTO";

export async function reportsRoutes(app: FastifyTypedInstance) {
    // POST /v1/reports - Criar nova denúncia
    app.post("/", {
        schema: {
            tags: ["Reports"],
            summary: "Criar nova denúncia",
            description: "Cria uma nova denúncia completa com todas as entidades relacionadas (pessoas, clubes, evidências, focos de manipulação).",
            body: CreateReportSchema,
            params: null,
            querystring: null,
            response: {
                200: CreateReportResponseSchema
            }
        }
    }, new CreateReportController().handle);

    // GET /v1/reports - Listar denúncias
    app.get("/", {
        schema: {
            tags: ["Reports"],
            summary: "Listar denúncias com filtros", // (Opcional) Melhorar a descrição
            description: "Lista denúncias com filtros avançados e paginação. Endpoint protegido para backoffice.", // (Opcional)
            body: null,
            params: null,
            querystring: GetReportsQuerySchemaDTO,
            response: {
                200: ReportsListResponseSchema
            }
        }
    }, new GetReportsController().handle);

    // GET /v1/reports/:id - Visualizar denúncia completa
    app.get("/:id", {
        schema: {
            tags: ["Reports"],
            summary: "Visualizar denúncia completa",
            description: "Obtém todos os detalhes de uma denúncia específica, incluindo entidades relacionadas. Endpoint protegido.",
            body: null,
            params: z.object({
                id: z.string().uuid("ID deve ser um UUID válido")
            }),
            querystring: null,
            response: {
                200: ReportResponseSchema
            }
        }
    }, new GetReportByIdController().handle);

    // PATCH /v1/reports/:id - Atualizar status da denúncia
    app.patch("/:id", {
        schema: {
            tags: ["Reports"],
            summary: "Atualizar status da denúncia",
            description: "Atualiza o status de uma denúncia específica. Endpoint protegido para backoffice.",
            body: UpdateReportStatusSchema,
            params: z.object({
                id: z.string().uuid("ID deve ser um UUID válido")
            }),
            querystring: null,
            response: {
                200: z.object({
                    message: z.string()
                })
            }
        }
    }, new UpdateReportStatusController().handle);

    // DEPRECATED: Endpoint removido após mudança para campos de string
    // Agora os municípios devem ser obtidos via APIs externas (ex: IBGE)
    /*
    // GET /v1/reports/municipios - Listar municípios (endpoint auxiliar)
    app.get("/municipios", {
        schema: {
            tags: ["Reports"],
            summary: "Listar municípios",
            description: "Lista todos os municípios disponíveis para usar nas denúncias.",
            body: null,
            params: null,
            querystring: null,
            response: {
                200: z.array(z.object({
                    id: z.string().uuid(),
                    nome: z.string(),
                    uf: z.string()
                }))
            }
        }
    }, new GetMunicipiosController().handle);
    */
}