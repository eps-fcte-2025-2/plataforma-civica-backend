import bcrypt from 'bcryptjs';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateUserInputDto } from '../dtos/CreateUserInputDto';
import { UserOutputDto } from '../dtos/UserOutputDto';
import { ConflictError } from '../../../shared/errors/ConflictError';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserInputDto): Promise<UserOutputDto> {
    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Usuário já existe com este email');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      ...data,
      passwordHash
    });

    return user;
  }
}
