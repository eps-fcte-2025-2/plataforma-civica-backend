import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

import { CreateUserUseCase } from '../../../../src/modules/user/usecases/CreateUserUseCase';
import { ConflictError } from '../../../../src/shared/errors/ConflictError';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepositoryMock: any;

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };

    createUserUseCase = new CreateUserUseCase(userRepositoryMock);

    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');
  });

  it('deve criar um usuário com sucesso', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.create.mockResolvedValue({
      id: '123',
      name: 'Carlos',
      email: 'carlos@test.com',
      passwordHash: 'hashed_password',
    });

    const result = await createUserUseCase.execute({
      name: 'Carlos',
      email: 'carlos@test.com',
      password: '123456',
    });

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('carlos@test.com');
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      name: 'Carlos',
      email: 'carlos@test.com',
      password: expect.any(String),
      passwordHash: 'hashed_password',
      });

    expect(result).toEqual({
      id: '123',
      name: 'Carlos',
      email: 'carlos@test.com',
      passwordHash: 'hashed_password',
    });
  });

  it('deve lançar ConflictError se email já existir', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({ id: '1', email: 'carlos@test.com' });

    await expect(
      createUserUseCase.execute({
        name: 'Carlos',
        email: 'carlos@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
