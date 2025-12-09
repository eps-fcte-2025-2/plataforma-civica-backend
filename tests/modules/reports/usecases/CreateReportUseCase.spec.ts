import { describe, it, beforeEach, expect, vi } from 'vitest';
import { CreateReportUseCase } from '../../../../src/modules/reports/usecases/CreateReportUseCase';
import { BadRequestError } from '../../../../src/shared/errors/BadRequestError';

// Mock do Repositório
const reportsRepositoryMock = {
  create: vi.fn(),
  // Outros métodos não usados neste fluxo podem ser ignorados ou definidos genericamente
  findById: vi.fn(),
  exists: vi.fn(),
  updateStatus: vi.fn(),
  findMany: vi.fn(),
};

describe('CreateReportUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar uma denúncia comum com sucesso', async () => {
    // Arrange
    const useCase = new CreateReportUseCase(reportsRepositoryMock as any);
    const validData: any = {
      tipoDenuncia: 'OUTROS',
      descricao: 'Descrição genérica',
      partidas: [] // Array vazio é permitido se não for PARTIDA_ESPECIFICA
    };

    // O repositório retorna o ID da nova denúncia
    reportsRepositoryMock.create.mockResolvedValue('new-uuid-123');

    // Act
    const result = await useCase.execute(validData);

    // Assert
    expect(result).toEqual({
      id: 'new-uuid-123',
      message: 'Denúncia criada com sucesso',
      createdAt: expect.any(String), // Verifica se é uma string (ISO date)
    });
    expect(reportsRepositoryMock.create).toHaveBeenCalledWith(validData);
  });

  it('deve lançar BadRequestError se PARTIDA_ESPECIFICA não tiver partidas', async () => {
    // Arrange
    const useCase = new CreateReportUseCase(reportsRepositoryMock as any);
    const invalidData: any = {
      tipoDenuncia: 'PARTIDA_ESPECIFICA',
      partidas: [] // VAZIO: deve falhar
    };

    // Act & Assert
    await expect(useCase.execute(invalidData))
      .rejects
      .toBeInstanceOf(BadRequestError);

    // Garante que a regra de negócio barrou a chamada ao banco
    expect(reportsRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestError se PARTIDA_ESPECIFICA tiver propriedade partidas undefined', async () => {
    // Arrange
    const useCase = new CreateReportUseCase(reportsRepositoryMock as any);
    const invalidData: any = {
      tipoDenuncia: 'PARTIDA_ESPECIFICA',
      // propriedade 'partidas' nem existe
    };

    // Act & Assert
    await expect(useCase.execute(invalidData))
      .rejects
      .toBeInstanceOf(BadRequestError);
      
    expect(reportsRepositoryMock.create).not.toHaveBeenCalled();
  });
});