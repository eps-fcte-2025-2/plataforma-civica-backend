import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateReportStatusUseCase } from "../../../../src/modules/reports/usecases/UpdateReportStatusUseCase";
import { NotFoundError } from "../../../../src/shared/errors/NotFoundError";

// Mock do Repositório
const reportsRepositoryMock = {
  exists: vi.fn(),
  updateStatus: vi.fn(),
  // Métodos não usados neste teste podem ser omitidos ou definidos como vi.fn()
  create: vi.fn(),
  findById: vi.fn(),
  findMany: vi.fn(),
};

describe('UpdateReportStatusUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve atualizar o status quando a denúncia existir', async () => {
    // Arrange
    const useCase = new UpdateReportStatusUseCase(reportsRepositoryMock as any);
    const reportId = 'uuid-valido';
    const updateData = { status: 'IN_PROGRESS' } as any;

    // Simula que a denúncia existe no banco
    reportsRepositoryMock.exists.mockResolvedValue(true);

    // Act
    await useCase.execute(reportId, updateData);

    // Assert
    expect(reportsRepositoryMock.exists).toHaveBeenCalledWith(reportId);
    expect(reportsRepositoryMock.updateStatus).toHaveBeenCalledWith(reportId, updateData);
  });

  it('deve lançar NotFoundError quando a denúncia não existir', async () => {
    // Arrange
    const useCase = new UpdateReportStatusUseCase(reportsRepositoryMock as any);
    const reportId = 'uuid-inexistente';
    const updateData = { status: 'DONE' } as any;

    // Simula que a denúncia NÃO existe
    reportsRepositoryMock.exists.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(reportId, updateData))
      .rejects
      .toBeInstanceOf(NotFoundError);

    // Garante que NÃO tentou atualizar
    expect(reportsRepositoryMock.updateStatus).not.toHaveBeenCalled();
  });
});