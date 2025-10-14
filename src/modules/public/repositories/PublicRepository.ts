import { DashboardMetricsResponse } from "../dtos/DashboardMetricsDTO";

export interface PublicRepository {
    /**
     * Obtém métricas públicas e anonimizadas para o dashboard
     */
    getDashboardMetrics(): Promise<DashboardMetricsResponse>;
}