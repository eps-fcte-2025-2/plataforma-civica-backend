import { ReportsListResponse } from "../dtos/ReportResponseDTO";
import { FindManyReportsOptionsDTO, ReportsRepository } from "../repositories/ReportsRepository";

type GetReportsRequest = FindManyReportsOptionsDTO;

export class GetReportsUseCase {
    constructor(private reportsRepository: ReportsRepository) {}

    async execute(request: GetReportsRequest): Promise<ReportsListResponse> {
        const { page, pageSize, filters } = request;

        // Validar parâmetros de paginação
        const validatedPage = Math.max(1, page || 1);
        const validatedPageSize = Math.min(Math.max(1, pageSize || 10), 100); // Default 10, Máximo 100

        const { reports, total } = await this.reportsRepository.findMany({
            page: validatedPage,
            pageSize: validatedPageSize,
            filters: filters || {} // Passa os filtros para o repositório
        });

        const totalPages = Math.ceil(total / validatedPageSize);

        return {
            reports,
            pagination: {
                page: validatedPage,
                pageSize: validatedPageSize,
                total,
                totalPages
            }
        };
    }
}