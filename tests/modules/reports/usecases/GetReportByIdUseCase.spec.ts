import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetReportByIdUseCase } from "../../../../src/modules/reports/usecases/GetReportByIdUseCase";
import { NotFoundError } from "../../../../src/shared/errors/NotFoundError";

// Mock do Repositório
const reportsRepositoryMock = {
  findById: vi.fn(),
  exists: vi.fn(),
  updateStatus: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
};

describe('GetReportByIdUseCase', () => {
  // Resetar os mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar uma denúncia quando o ID existir', async () => {
    // Arrange (Preparar)
    const useCase = new GetReportByIdUseCase(reportsRepositoryMock as any);
    const mockReport = {
        id: '123',
        tipoDenuncia: 'MATCH_FIXING',
        status: 'PENDING'
    };

    // Simulando que o banco achou algo
    reportsRepositoryMock.findById.mockResolvedValue(mockReport);

    // Act (Executar)
    const result = await useCase.execute('123');

    // Assert (Verificar)
    expect(result).toEqual(mockReport);
    expect(reportsRepositoryMock.findById).toHaveBeenCalledWith('123');
  });

  it('deve lançar NotFoundError quando a denúncia não existir', async () => {
    // Arrange
    const useCase = new GetReportByIdUseCase(reportsRepositoryMock as any);
    
    // Simulando que o banco retornou null
    reportsRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('id-inexistente'))
        .rejects
        .toBeInstanceOf(NotFoundError);
  });
});