import { FastifyTypedInstance } from "../../../../shared/types/types";
import { DashboardMetricsResponseSchema } from "../../dtos/DashboardMetricsDTO";
import { GetDashboardMetricsController } from "../../controllers/GetDashboardMetricsController";

export async function publicRoutes(app: FastifyTypedInstance) {
    // GET /v1/public/dashboard-metrics - Obter métricas públicas para o dashboard
    app.get("/dashboard-metrics", {
        schema: {
            tags: ["Public"],
            summary: "Obter métricas públicas do dashboard",
            description: "Retorna dados anonimizados e agregados para o dashboard público, incluindo estatísticas gerais e dados para mapas.",
            body: null,
            params: null,
            querystring: null,
            response: {
                200: DashboardMetricsResponseSchema
            }
        }
    }, new GetDashboardMetricsController().handle);
}