import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ReportResponse } from '../dtos/ReportResponseDTO';
import { ReportsRepository } from '../repositories/ReportsRepository';

export class GetReportByIdUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute(id: string): Promise<ReportResponse> {
    const report = await this.reportsRepository.findById(id);

    if (!report) {
      throw new NotFoundError('Denúncia não encontrada');
    }

    return report;
  }
}
