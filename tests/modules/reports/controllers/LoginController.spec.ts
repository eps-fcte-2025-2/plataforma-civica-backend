import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginController } from '../../../../src/modules/user/controllers/LoginController';

describe('LoginController', () => {
  let loginUseCaseMock: any;
  let loginController: LoginController;
  let replyMock: any;

  beforeEach(() => {
    loginUseCaseMock = {
      execute: vi.fn(),
    };

    loginController = new LoginController(loginUseCaseMock);

    replyMock = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it('deve retornar 200 e o resultado do login', async () => {
    const fakeData = {
      token: 'tttt',
      user: { id: '1', name: 'Carlos', email: 'c@test.com', role: 'USER' },
    };

    loginUseCaseMock.execute.mockResolvedValue(fakeData);

    const requestMock = {
      body: {
        email: 'c@test.com',
        password: '123456',
      },
    } as any;

    await loginController.handle(requestMock, replyMock);

    expect(loginUseCaseMock.execute).toHaveBeenCalledWith(requestMock.body);
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(fakeData);
  });

  it('deve lançar erro se o usecase lançar erro', async () => {
    const error = new Error('Falhou');
    loginUseCaseMock.execute.mockRejectedValue(error);

    const requestMock = {
      body: {
        email: 'c@test.com',
        password: '123456',
      },
    } as any;

    await expect(loginController.handle(requestMock, replyMock)).rejects.toThrow(error);
  });
});
