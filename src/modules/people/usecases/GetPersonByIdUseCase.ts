import { PeopleRepository } from '../repositories/PeopleRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError'; 

export class GetPersonByIdUseCase {
  constructor(private repository: PeopleRepository) {}

  async execute(id: string) {
    const pessoa = await this.repository.findById(id);

    if (!pessoa) {
      throw new NotFoundError('Pessoa não encontrada.');
    }

    return pessoa;
  }
}