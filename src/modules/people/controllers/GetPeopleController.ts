import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { FindManyPeopleQuerySchemaType } from "../dtos/FindManyPeopleOptionsDTO";
import { PeopleListResponseSchemaType } from "../dtos/PeopleResponseDTO";
import { buildGetPeopleUseCase } from "../factories/PeopleUseCaseFactory";

export class GetPeopleController implements Controller<
  any,
  any,
  FindManyPeopleQuerySchemaType,
  { 200: PeopleListResponseSchemaType }
> {
  async handle(
    request: TypedRequest<any, any, FindManyPeopleQuerySchemaType>,
    response: TypedResponse<{ 200: PeopleListResponseSchemaType }>
  ): Promise<void> {
    const options = request.query; 

    const getPeopleUseCase = buildGetPeopleUseCase();
    const result = await getPeopleUseCase.execute(options);

    response.status(200).send(result);
  }
}