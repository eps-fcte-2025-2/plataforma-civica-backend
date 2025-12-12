import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetDashboardMetricsUseCase } from '../../../../src/modules/public/usecases/GetDashboardMetricsUseCase';
import { EMPTY_METRICS, SAMPLE_METRICS } from '../fixtures/dashboardMetricsFixtures';

describe('GetDashboardMetricsUseCase', () => {
  let repoMock: any;
  let useCase: GetDashboardMetricsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    repoMock = {
      getDashboardMetrics: vi.fn().mockResolvedValue(SAMPLE_METRICS),
    };

    useCase = new GetDashboardMetricsUseCase(repoMock as any);
  });

  it('should call repository and return metrics', async () => {
    const result = await useCase.execute();

    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
    expect(result).toEqual(SAMPLE_METRICS);
  });

  it('should throw error when repository fails', async () => {
    const error = new Error('Database connection failed');
    repoMock.getDashboardMetrics.mockRejectedValueOnce(error);

    await expect(useCase.execute()).rejects.toThrow('Database connection failed');
    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
  });

  it('should return empty metrics when no data exists', async () => {
    repoMock.getDashboardMetrics.mockResolvedValueOnce(EMPTY_METRICS);
    const result = await useCase.execute();

    expect(result).toEqual(EMPTY_METRICS);
    expect(repoMock.getDashboardMetrics).toHaveBeenCalledOnce();
  });
});
