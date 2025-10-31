import { PeopleRepositoryImpl } from '../infra/repositories/PeopleRepositoryImpl';
import { GetPeopleUseCase } from '../usecases/GetPeopleUseCase';
import { GetPersonByIdUseCase } from '../usecases/GetPersonByIdUseCase';
import { UpdatePersonUseCase } from '../usecases/UpdatePersonUseCase';

export function buildGetPeopleUseCase(): GetPeopleUseCase {
  const repository = new PeopleRepositoryImpl();
  return new GetPeopleUseCase(repository);
}

export function buildGetPersonByIdUseCase(): GetPersonByIdUseCase {
  const repository = new PeopleRepositoryImpl();
  return new GetPersonByIdUseCase(repository);
}

export function buildUpdatePersonUseCase(): UpdatePersonUseCase {
  const repository = new PeopleRepositoryImpl();
  return new UpdatePersonUseCase(repository);
}