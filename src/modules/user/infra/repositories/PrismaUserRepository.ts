import { PrismaClient } from '../../../../../generated/prisma';
import { IUserRepository } from '../../repositories/IUserRepository';
import { CreateUserInputDto } from '../../dtos/CreateUserInputDto';
import { UserOutputDto } from '../../dtos/UserOutputDto';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserInputDto & { passwordHash: string }): Promise<UserOutputDto> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<(UserOutputDto & { passwordHash: string }) | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN',
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<UserOutputDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
