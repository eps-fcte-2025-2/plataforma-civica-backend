import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { UpdateReportStatus } from '../dtos/UpdateReportStatusDTO';
import { ReportsRepository } from '../repositories/ReportsRepository';

export class UpdateReportStatusUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute(id: string, data: UpdateReportStatus): Promise<void> {
    // Verificar se a denúncia existe
    const reportExists = await this.reportsRepository.exists(id);
    if (!reportExists) {
      throw new NotFoundError('Denúncia não encontrada');
    }

    // Atualizar o status
    await this.reportsRepository.updateStatus(id, data);
  }
}
