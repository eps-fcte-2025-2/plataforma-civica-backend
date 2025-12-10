import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { GetReportByIdController } from "../../../../src/modules/reports/controllers/GetReportByIdController";
import { buildGetReportByIdUseCase } from "../../../../src/modules/reports/factories/ReportsUseCaseFactory";

// 1. Dizemos ao Vitest para substituir este arquivo real por um mock
vi.mock('../../../../src/modules/reports/factories/ReportsUseCaseFactory');

describe('GetReportByIdController', () => {
  let controller: GetReportByIdController;
  let requestMock: any;
  let responseMock: any;
  let useCaseMock: any;

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();

    // 2. Criamos o mock do UseCase (o objeto que a factory devolve)
    useCaseMock = {
      execute: vi.fn(),
    };

    // 3. Configura a factory mockada para devolver nosso useCaseMock
    (buildGetReportByIdUseCase as unknown as Mock).mockReturnValue(useCaseMock);

    // 4. Mocks do Express (Request e Response)
    requestMock = {
      params: {
        id: 'uuid-valido-123',
      },
    };

    responseMock = {
      // O mockReturnThis permite encadear: response.status(200).send(...)
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    controller = new GetReportByIdController();
  });

  it('deve lançar erro quando o useCase falhar', async () => {
    // Arrange
    const error = new Error('Denúncia não encontrada');
    // Simulamos que o UseCase explodiu com um erro
    useCaseMock.execute.mockRejectedValue(error);

    // Act & Assert
    // Esperamos que o controller.handle também exploda com o mesmo erro
    await expect(controller.handle(requestMock, responseMock))
      .rejects
      .toThrow('Denúncia não encontrada');
    
    // Garante que não tentou enviar resposta de sucesso
    expect(responseMock.status).not.toHaveBeenCalled();
    expect(responseMock.send).not.toHaveBeenCalled();
  });

  it('deve chamar o useCase com o ID correto e retornar status 200', async () => {
    // Arrange (Preparar)
    const fakeReport = { id: 'uuid-valido-123', status: 'PENDING' };
    useCaseMock.execute.mockResolvedValue(fakeReport);

    // Act (Executar)
    await controller.handle(requestMock, responseMock);

    // Assert (Verificar)
    // Verifica se extraiu o ID do request e passou pro usecase
    expect(useCaseMock.execute).toHaveBeenCalledWith('uuid-valido-123');
    
    // Verifica se respondeu com 200
    expect(responseMock.status).toHaveBeenCalledWith(200);
    
    // Verifica se enviou o json correto
    expect(responseMock.send).toHaveBeenCalledWith(fakeReport);
  });
});