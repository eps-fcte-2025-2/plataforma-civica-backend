import { ReportsListResponse } from "../dtos/ReportResponseDTO";
import { ReportsRepository } from "../repositories/ReportsRepository";

interface GetReportsRequest {
    page: number;
    pageSize: number;
}

export class GetReportsUseCase {
    constructor(private reportsRepository: ReportsRepository) {}

    async execute(request: GetReportsRequest): Promise<ReportsListResponse> {
        const { page, pageSize } = request;

        // Validar parâmetros de paginação
        const validatedPage = Math.max(1, page);
        const validatedPageSize = Math.min(Math.max(1, pageSize), 100); // Máximo de 100 itens por página

        const { reports, total } = await this.reportsRepository.findMany(validatedPage, validatedPageSize);

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