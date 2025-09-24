import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { CreateReportSchemaType, CreateReport } from "../dtos/CreateReportDTO";
import { CreateReportResponseSchemaType } from "../dtos/ReportResponseDTO";
import { buildCreateReportUseCase } from "../factories/ReportsUseCaseFactory";

export class CreateReportController implements Controller<
    CreateReportSchemaType, 
    any, 
    any, 
    { 200: CreateReportResponseSchemaType }
> {
    async handle(
        request: TypedRequest<CreateReportSchemaType, any, any>,
        response: TypedResponse<{ 200: CreateReportResponseSchemaType }>
    ): Promise<void> {
        const data: CreateReport = request.body;

        const createReportUseCase = buildCreateReportUseCase();
        const result = await createReportUseCase.execute(data);

        response.status(200).send(result);
    }
}