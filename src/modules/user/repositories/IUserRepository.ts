import { CreateUserInputDto } from '../dtos/CreateUserInputDto';
import { UserOutputDto } from '../dtos/UserOutputDto';

export interface IUserRepository {
  create(data: CreateUserInputDto & { passwordHash: string }): Promise<UserOutputDto>;
  findByEmail(email: string): Promise<(UserOutputDto & { passwordHash: string }) | null>;
  findById(id: string): Promise<UserOutputDto | null>;
}
