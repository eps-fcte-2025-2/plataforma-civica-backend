import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

import { LoginUseCase } from '../../../../src/modules/user/usecases/LoginUseCase';
import { UnauthorizedError } from '../../../../src/shared/errors/UnauthorizedError';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepositoryMock: any;
  let jwtSignMock: any;

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: vi.fn(),
    };

    jwtSignMock = vi.fn();

    loginUseCase = new LoginUseCase(userRepositoryMock, jwtSignMock);

    // mock bcrypt.compare
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  });

  it('deve logar com sucesso e retornar token + dados do usuário', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({
      id: '1',
      name: 'Carlos',
      email: 'carlos@test.com',
      role: 'USER',
      passwordHash: 'hashed_password',
    });

    jwtSignMock.mockResolvedValue('fake_token');

    const result = await loginUseCase.execute({
      email: 'carlos@test.com',
      password: '123456',
    });

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('carlos@test.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed_password');
    expect(jwtSignMock).toHaveBeenCalled();

    expect(result).toEqual({
      token: 'fake_token',
      user: {
        id: '1',
        name: 'Carlos',
        email: 'carlos@test.com',
        role: 'USER',
      },
    });
  });

  it('deve lançar UnauthorizedError se usuário não existir', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'carlos@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('deve lançar UnauthorizedError se a senha for inválida', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({
      id: '1',
      name: 'Carlos',
      email: 'carlos@test.com',
      role: 'USER',
      passwordHash: 'hashed_password',
    });

    // força bcrypt a retornar falso
    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(
      loginUseCase.execute({
        email: 'carlos@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
