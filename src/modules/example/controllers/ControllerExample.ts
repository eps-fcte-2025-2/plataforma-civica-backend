import { PaginateQuerySchemaType } from "../../../shared/dtos/PaginationSchema";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { RequestDTOExampleSchemaType } from "../dtos/RequestDTOExample";
import { ResponseDTOExampleSchemaType } from "../dtos/ResponseDTOExample";
import { buildExampleUseCase } from "../factories/ExampleUseCaseFactory";

export class ControllerExample implements Controller<
    RequestDTOExampleSchemaType, any, PaginateQuerySchemaType, { 200: ResponseDTOExampleSchemaType }
> {
    async handle(
        request: TypedRequest<RequestDTOExampleSchemaType, any, PaginateQuerySchemaType>,
        response: TypedResponse<{ 200: ResponseDTOExampleSchemaType }>
    ): Promise<void> {
        const { nome } = request.body;
        const { page, pageSize } = request.query;

        const exampleUseCase = buildExampleUseCase();
        const exampleResponse = await exampleUseCase.execute({
            nome,
            page,
            pageSize
        });

        throw new NotFoundError("Fez tudo errado ae mano");

        response.status(200).send(exampleResponse);
    }
}