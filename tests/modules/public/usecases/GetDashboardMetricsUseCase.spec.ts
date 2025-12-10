import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetDashboardMetricsUseCase } from '../../../../src/modules/public/usecases/GetDashboardMetricsUseCase';

describe('GetDashboardMetricsUseCase', () => {
  let repoMock: any;
  let useCase: GetDashboardMetricsUseCase;

  const sampleMetrics = {
    totalDenuncias: 42,
    denunciasPorStatus: {
      pendentes: 1,
      emAnalise: 2,
      aprovadas: 3,
      rejeitadas: 4,
      arquivadas: 5,
    },
    denunciasPorTipo: {
      partidaEspecifica: 6,
      esquemaManipulacao: 7,
    },
    denunciasPorRegiao: [{ uf: 'SP', total: 10 }],
    dadosParaMapa: [{ municipio: 'São Paulo', uf: 'SP', total: 10 }],
    evolucaoTemporal: [{ periodo: '2025-12', total: 12 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    repoMock = {
      getDashboardMetrics: vi.fn().mockResolvedValue(sampleMetrics),
    };

    useCase = new GetDashboardMetricsUseCase(repoMock as any);
  });

  it('should call repository and return metrics', async () => {
    const result = await useCase.execute();

    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
    expect(result).toEqual(sampleMetrics);
  });

  it('should throw error when repository fails', async () => {
    const error = new Error('Database connection failed');
    repoMock.getDashboardMetrics.mockRejectedValueOnce(error);

    await expect(useCase.execute()).rejects.toThrow('Database connection failed');
    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
  });

  it('should return empty metrics when no data exists', async () => {
    const emptyMetrics = {
      totalDenuncias: 0,
      denunciasPorStatus: {
        pendentes: 0,
        emAnalise: 0,
        aprovadas: 0,
        rejeitadas: 0,
        arquivadas: 0,
      },
      denunciasPorTipo: {
        partidaEspecifica: 0,
        esquemaManipulacao: 0,
      },
      denunciasPorRegiao: [],
      dadosParaMapa: [],
      evolucaoTemporal: [],
    };

    repoMock.getDashboardMetrics.mockResolvedValueOnce(emptyMetrics);
    const result = await useCase.execute();

    expect(result).toEqual(emptyMetrics);
    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
  });
});
