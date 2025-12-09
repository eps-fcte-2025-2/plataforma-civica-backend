import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateReportStatusController } from "../../../../src/modules/reports/controllers/UpdateReportStatusController";
import { buildUpdateReportStatusUseCase } from "../../../../src/modules/reports/factories/ReportsUseCaseFactory";

// Dizemos ao Jest para substituir o arquivo da factory por um mock
vi.mock('../../../../src/modules/reports/factories/ReportsUseCaseFactory');

describe('UpdateReportStatusController', () => {
  let controller: UpdateReportStatusController;
  let requestMock: any;
  let responseMock: any;
  let useCaseMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Criamos o mock do UseCase
    useCaseMock = {
      execute: vi.fn(),
    };

    // Configuramos a factory para devolver nosso mock
    (buildUpdateReportStatusUseCase as any).mockReturnValue(useCaseMock);

    // Mock do Request (simulando params e body)
    requestMock = {
      params: {
        id: 'uuid-123',
      },
      body: {
        status: 'RESOLVED',
        observacao: 'Resolvido com sucesso',
      },
    };

    // Mock do Response
    responseMock = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    controller = new UpdateReportStatusController();
  });

  it('deve chamar o useCase com os dados corretos e retornar 200', async () => {
    // Act
    await controller.handle(requestMock, responseMock);

    // Assert
    // Verifica se os parâmetros extraídos do request foram passados pro useCase
    expect(useCaseMock.execute).toHaveBeenCalledWith(
      'uuid-123',
      {
        status: 'RESOLVED',
        observacao: 'Resolvido com sucesso',
      }
    );

    // Verifica a resposta HTTP
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith({
      message: 'Denúncia atualizado com sucesso',
    });
  });

  it('deve repassar o erro caso o useCase falhe', async () => {
    // Arrange: Simula um erro vindo do UseCase (ex: NotFoundError)
    const error = new Error('Denúncia não encontrada');
    useCaseMock.execute.mockRejectedValue(error);

    // Act & Assert
    await expect(controller.handle(requestMock, responseMock))
      .rejects
      .toThrow('Denúncia não encontrada');

    // Garante que não enviou resposta de sucesso
    expect(responseMock.status).not.toHaveBeenCalled();
  });
});