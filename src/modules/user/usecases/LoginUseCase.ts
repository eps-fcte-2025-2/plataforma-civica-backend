import bcrypt from 'bcryptjs';
import { IUserRepository } from '../repositories/IUserRepository';
import { LoginInputDto } from '../dtos/LoginInputDto';
import { LoginOutputDto } from '../dtos/LoginOutputDto';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSign: (payload: any, options?: any) => Promise<string>
  ) {}

  async execute(data: LoginInputDto): Promise<LoginOutputDto> {
    // Buscar usuário
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // Gerar token
    const token = await this.jwtSign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
