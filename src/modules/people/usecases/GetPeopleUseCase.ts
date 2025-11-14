import { PeopleRepository } from '../repositories/PeopleRepository';
import { FindManyPeopleQueryDTO } from '../dtos/FindManyPeopleOptionsDTO';

export class GetPeopleUseCase {
  constructor(private repository: PeopleRepository) {}

  async execute(options: FindManyPeopleQueryDTO) {
    // A validação Zod já garante que os tipos estão corretos.
    return this.repository.findMany(options);
  }
}