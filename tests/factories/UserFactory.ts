import { vi } from 'vitest';

import type { UserOutputDto } from '../../src/modules/user/dtos/UserOutputDto';

export class UserFactory {
  static createUserOutput(overrides?: Partial<UserOutputDto>): UserOutputDto {
    const defaultUser: UserOutputDto = {
      id: '123',
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'ADMIN',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    return { ...defaultUser, ...overrides };
  }

  static createUserRepositoryMock() {
    return {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
    };
  }
}
