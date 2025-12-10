import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetDashboardMetricsController } from '../../../../src/modules/public/controllers/GetDashboardMetricsController';
import { GetDashboardMetricsUseCase } from '../../../../src/modules/public/usecases/GetDashboardMetricsUseCase';
import { PublicRepositoryImpl } from '../../../../src/modules/public/infra/repositories/PublicRepositoryImpl';

// Mock apenas o repositório para testar o fluxo real do useCase
vi.mock('../../../../src/modules/public/infra/repositories/PublicRepositoryImpl');

describe('GetDashboardMetricsController', () => {
  let controller: GetDashboardMetricsController;
  let repoMock: any;
  let requestMock: any;
  let replyMock: any;

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

    // Mockar o constructor do PublicRepositoryImpl
    (PublicRepositoryImpl as any).mockImplementation(() => repoMock);

    controller = new GetDashboardMetricsController();

    requestMock = {};
    replyMock = {
      code: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it('should call usecase and return 200 with metrics', async () => {
    await controller.handle(requestMock as any, replyMock as any);

    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
    expect(replyMock.code).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(sampleMetrics);
  });

  it('should return 200 with empty metrics when no data exists', async () => {
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

    await controller.handle(requestMock as any, replyMock as any);

    expect(replyMock.code).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(emptyMetrics);
  });

  it('should propagate repository errors to reply', async () => {
    const error = new Error('Database connection failed');
    repoMock.getDashboardMetrics.mockRejectedValueOnce(error);

    await expect(controller.handle(requestMock as any, replyMock as any)).rejects.toThrow(
      'Database connection failed'
    );
  });
});
