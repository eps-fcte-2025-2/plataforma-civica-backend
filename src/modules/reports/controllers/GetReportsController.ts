import { PaginateQuerySchemaType } from "../../../shared/dtos/PaginationSchema";
import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { ReportsListResponseSchemaType } from "../dtos/ReportResponseDTO";
import { buildGetReportsUseCase } from "../factories/ReportsUseCaseFactory";

export class GetReportsController implements Controller<
    any,
    any,
    PaginateQuerySchemaType,
    { 200: ReportsListResponseSchemaType }
> {
    async handle(
        request: TypedRequest<any, any, PaginateQuerySchemaType>,
        response: TypedResponse<{ 200: ReportsListResponseSchemaType }>
    ): Promise<void> {
        const { page, pageSize } = request.query;

        const getReportsUseCase = buildGetReportsUseCase();
        const result = await getReportsUseCase.execute({ page, pageSize });

        response.status(200).send(result);
    }
}