import { IUserRepository } from '../repositories/IUserRepository';
import { UserOutputDto } from '../dtos/UserOutputDto';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserOutputDto> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }
}
