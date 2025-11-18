import z from 'zod';

import { Controller, TypedRequest, TypedResponse } from '../../../shared/patterns/Controller';
import { ReportResponseSchemaType } from '../dtos/ReportResponseDTO';
import { buildGetReportByIdUseCase } from '../factories/ReportsUseCaseFactory';

const GetReportParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

export class GetReportByIdController
  implements Controller<any, typeof GetReportParamsSchema, any, { 200: ReportResponseSchemaType }>
{
  async handle(
    request: TypedRequest<any, typeof GetReportParamsSchema, any>,
    response: TypedResponse<{ 200: ReportResponseSchemaType }>
  ): Promise<void> {
    const { id } = request.params;

    const getReportByIdUseCase = buildGetReportByIdUseCase();
    const result = await getReportByIdUseCase.execute(id);

    response.status(200).send(result);
  }
}
