import z from "zod";
import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { UpdateReportStatusSchemaType } from "../dtos/UpdateReportStatusDTO";
import { buildUpdateReportStatusUseCase } from "../factories/ReportsUseCaseFactory";

const UpdateReportParamsSchema = z.object({
    id: z.string().uuid("ID deve ser um UUID válido")
});

const UpdateReportResponseSchema = z.object({
    message: z.string()
});

export class UpdateReportStatusController implements Controller<
    UpdateReportStatusSchemaType,
    typeof UpdateReportParamsSchema,
    any,
    { 200: typeof UpdateReportResponseSchema }
> {
    async handle(
        request: TypedRequest<UpdateReportStatusSchemaType, typeof UpdateReportParamsSchema, any>,
        response: TypedResponse<{ 200: typeof UpdateReportResponseSchema }>
    ): Promise<void> {
        const { id } = request.params;
        const data = request.body;

        const updateReportStatusUseCase = buildUpdateReportStatusUseCase();
        await updateReportStatusUseCase.execute(id, data);

        response.status(200).send({
            message: "Denúncia atualizado com sucesso"
        });
    }
}