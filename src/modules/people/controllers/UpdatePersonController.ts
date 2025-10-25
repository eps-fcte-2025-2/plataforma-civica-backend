import { Controller, TypedRequest, TypedResponse } from "../../../shared/patterns/Controller";
import { z } from "zod";
import { UpdatePersonSchemaType, UpdatePersonDTO } from "../dtos/UpdatePersonDTO";
import { PersonResponseSchemaType } from "../dtos/PeopleResponseDTO";
import { buildUpdatePersonUseCase } from "../factories/PeopleUseCaseFactory";

const ParamsSchema = z.object({
  id: z.string().uuid('ID de pessoa inválido.'),
});

export type UpdatePersonParamsType = typeof ParamsSchema;

export class UpdatePersonController implements Controller<
  UpdatePersonSchemaType,
  UpdatePersonParamsType,
  any,
  { 200: PersonResponseSchemaType }
> {
  async handle(
    request: TypedRequest<UpdatePersonSchemaType, UpdatePersonParamsType, any>,
    response: TypedResponse<{ 200: PersonResponseSchemaType }>
  ): Promise<void> {
    const { id } = request.params;
    const data: UpdatePersonDTO = request.body;

    const updatePersonUseCase = buildUpdatePersonUseCase();
    const pessoaAtualizada = await updatePersonUseCase.execute(id, data);
    
    // Retorna a pessoa atualizada (necessita mapeamento se a interface do UseCase retornar a entidade Prisma pura)
    // Para simplificar, assumiremos que a entidade Prisma retornada é compatível com o PersonResponseSchema
    response.status(200).send(pessoaAtualizada as any); 
  }
}