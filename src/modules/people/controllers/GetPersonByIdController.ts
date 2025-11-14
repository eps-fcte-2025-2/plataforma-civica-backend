import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { z } from "zod";
import { PersonResponseSchemaType } from "../dtos/PeopleResponseDTO";
import { buildGetPersonByIdUseCase } from "../factories/PeopleUseCaseFactory";

const ParamsSchema = z.object({
  id: z.string().uuid('ID de pessoa inválido.'),
});

export type GetPersonByIdParamsType = typeof ParamsSchema;

export class GetPersonByIdController implements Controller<
  any,
  GetPersonByIdParamsType,
  any,
  { 200: PersonResponseSchemaType }
> {
  async handle(
    request: TypedRequest<any, GetPersonByIdParamsType, any>,
    response: TypedResponse<{ 200: PersonResponseSchemaType }>
  ): Promise<void> {
    const { id } = request.params;

    const getPersonByIdUseCase = buildGetPersonByIdUseCase();
    const pessoa = await getPersonByIdUseCase.execute(id);

    response.status(200).send(pessoa);
  }
}