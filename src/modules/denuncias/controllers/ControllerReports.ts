import { ReportQuerySchemaType } from '../dtos/ReportFilterSchema';
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { ResponseDTOExampleSchemaType } from "../../reports/dtos/ResponseDTOReport";
import { buildExampleUseCase } from "../factories/ExampleUseCaseFactory";

export class ControllerReports {
  async getReports(
    request: TypedRequest<any, any, ReportQuerySchemaType>,
    response: TypedResponse<{ 200: ResponseDTOExampleSchemaType }>
  ): Promise<void> {
    const { data, esporte, status, score, page, pageSize } = request.query;

    const exampleUseCase = buildExampleUseCase();
    // const exampleResponse = await exampleUseCase.execute({
    //   data, esporte, status, score, page, pageSize
    // });

    throw new NotFoundError("Fez tudo errado ae mano");

    response.status(200).send(exampleResponse);
  }
}