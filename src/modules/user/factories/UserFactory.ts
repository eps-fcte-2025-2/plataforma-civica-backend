import { PrismaClient } from '../../../../generated/prisma';
import { PrismaUserRepository } from '../infra/repositories/PrismaUserRepository';
import { CreateUserUseCase } from '../usecases/CreateUserUseCase';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { GetUserProfileUseCase } from '../usecases/GetUserProfileUseCase';
import { CreateUserController } from '../controllers/CreateUserController';
import { LoginController } from '../controllers/LoginController';
import { GetUserProfileController } from '../controllers/GetUserProfileController';

export class UserFactory {
  private prisma: PrismaClient;
  private userRepository: PrismaUserRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.userRepository = new PrismaUserRepository(this.prisma);
  }

  createUserController(): CreateUserController {
    const createUserUseCase = new CreateUserUseCase(this.userRepository);
    return new CreateUserController(createUserUseCase);
  }

  loginController(jwtSign: (payload: any, options?: any) => Promise<string>): LoginController {
    const loginUseCase = new LoginUseCase(this.userRepository, jwtSign);
    return new LoginController(loginUseCase);
  }

  getUserProfileController(): GetUserProfileController {
    const getUserProfileUseCase = new GetUserProfileUseCase(this.userRepository);
    return new GetUserProfileController(getUserProfileUseCase);
  }
}
