import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { ReportsListResponseSchemaType } from "../dtos/ReportResponseDTO";
import { GetReportsQuerySchemaType } from "../dtos/GetReportsQuerySchemaDTO"; // <-- Importe o novo tipo
import { buildGetReportsUseCase } from "../factories/ReportsUseCaseFactory";

export class GetReportsController implements Controller<
    any,
    any,
    GetReportsQuerySchemaType,
    { 200: ReportsListResponseSchemaType }
> {
    async handle(
        request: TypedRequest<any, any, GetReportsQuerySchemaType>,
        response: TypedResponse<{ 200: ReportsListResponseSchemaType }>
    ): Promise<void> {
        // 1. Extraia a paginação e os filtros da query
        const { page, pageSize, ...filters } = request.query;

        const getReportsUseCase = buildGetReportsUseCase();

        // 2. Passe a paginação e o objeto de filtros para o use case
        const result = await getReportsUseCase.execute({ 
            page, 
            pageSize, 
            filters // O objeto 'filters' contém todos os outros parâmetros
        });

        response.status(200).send(result);
    }
}