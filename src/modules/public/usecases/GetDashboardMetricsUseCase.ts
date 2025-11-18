import { DashboardMetricsResponse } from '../dtos/DashboardMetricsDTO';
import { PublicRepository } from '../repositories/PublicRepository';

export class GetDashboardMetricsUseCase {
  constructor(private publicRepository: PublicRepository) {}

  async execute(): Promise<DashboardMetricsResponse> {
    return await this.publicRepository.getDashboardMetrics();
  }
}
