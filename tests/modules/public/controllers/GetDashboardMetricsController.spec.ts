import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetDashboardMetricsController } from '../../../../src/modules/public/controllers/GetDashboardMetricsController';
import { PublicRepositoryImpl } from '../../../../src/modules/public/infra/repositories/PublicRepositoryImpl';
import { EMPTY_METRICS, SAMPLE_METRICS } from '../fixtures/dashboardMetricsFixtures';

// Mock apenas o repositório para testar o fluxo real do useCase
vi.mock('../../../../src/modules/public/infra/repositories/PublicRepositoryImpl');

describe('GetDashboardMetricsController', () => {
  let controller: GetDashboardMetricsController;
  let repoMock: any;
  let requestMock: any;
  let replyMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    repoMock = {
      getDashboardMetrics: vi.fn().mockResolvedValue(SAMPLE_METRICS),
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
    expect(replyMock.send).toHaveBeenCalledWith(SAMPLE_METRICS);
  });

  it('should return 200 with empty metrics when no data exists', async () => {
    repoMock.getDashboardMetrics.mockResolvedValueOnce(EMPTY_METRICS);

    await controller.handle(requestMock as any, replyMock as any);

    expect(replyMock.code).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(EMPTY_METRICS);
  });

  it('should propagate repository errors to reply', async () => {
    const error = new Error('Database connection failed');
    repoMock.getDashboardMetrics.mockRejectedValueOnce(error);

    await expect(controller.handle(requestMock as any, replyMock as any)).rejects.toThrow(
      'Database connection failed'
    );
  });
});
