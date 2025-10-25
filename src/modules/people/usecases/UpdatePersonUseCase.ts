import { PeopleRepository } from '../repositories/PeopleRepository';
import { UpdatePersonDTO } from '../dtos/UpdatePersonDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { PersonResponseDTO } from '../dtos/PeopleResponseDTO';

export class UpdatePersonUseCase {
  constructor(private repository: PeopleRepository) {}

  async execute(id: string, data: UpdatePersonDTO): Promise<PersonResponseDTO> {
    const pessoaExistente = await this.repository.exists(id);

    if (!pessoaExistente) {
      throw new NotFoundError('Pessoa não encontrada.');
    }

    try {
        return this.repository.update(id, data);
    } catch (error) {
         if (error.message === "Pessoa não encontrada.") {
             throw new NotFoundError('Pessoa não encontrada.');
         }
         throw error;
    }
  }
}