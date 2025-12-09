
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { CreateReportController } from '../../../../src/modules/reports/controllers/CreateReportController';
import { buildCreateReportUseCase } from '../../../../src/modules/reports/factories/ReportsUseCaseFactory';

// Substitui o arquivo da factory por um mock do Vitest
vi.mock('../../../../src/modules/reports/factories/ReportsUseCaseFactory');

describe('CreateReportController', () => {
  let controller: CreateReportController;
  let requestMock: any;
  let responseMock: any;
  let useCaseMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Criamos o mock do UseCase
    useCaseMock = {
      execute: vi.fn(),
    };

    // 2. Configuramos a factory para devolver nosso mock
    (buildCreateReportUseCase as Mock).mockReturnValue(useCaseMock);

    // 3. Mock do Request (simulando o body)
    requestMock = {
      body: {
        tipoDenuncia: 'MATCH_FIXING',
        descricao: 'Denúncia teste',
      },
    };

    // 4. Mock do Response
    responseMock = {
      status: vi.fn().mockReturnThis(), // permite response.status().send()
      send: vi.fn(),
    };

    controller = new CreateReportController();
  });

  it('deve chamar o useCase com o body correto e retornar 200', async () => {
    // Arrange
    const fakeResult = {
      id: 'uuid-123',
      message: 'Denúncia criada com sucesso',
      createdAt: '2023-01-01T00:00:00Z',
    };
    useCaseMock.execute.mockResolvedValue(fakeResult);

    // Act
    await controller.handle(requestMock, responseMock);

    // Assert
    // Verifica se os dados do body chegaram no useCase
    expect(useCaseMock.execute).toHaveBeenCalledWith(requestMock.body);
    
    // Verifica a resposta HTTP
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(fakeResult);
  });

  it('deve repassar o erro caso o useCase falhe (ex: BadRequest)', async () => {
    // Arrange
    const error = new Error('Para denúncias de partida específica...');
    useCaseMock.execute.mockRejectedValue(error);

    // Act & Assert
    // O controller não tem try/catch, então ele deve explodir o erro para o middleware
    await expect(controller.handle(requestMock, responseMock))
      .rejects
      .toThrow('Para denúncias de partida específica...');

    // Garante que não enviou sucesso
    expect(responseMock.status).not.toHaveBeenCalled();
  });
});