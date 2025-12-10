import { CreateReport } from '../dtos/CreateReportDTO';
import { FindManyReportsOptionsDTO } from '../dtos/FindManyReportsOptionsDTO';
import { ReportResponse, ReportSummaryResponse } from '../dtos/ReportResponseDTO';
import { UpdateReportStatus } from '../dtos/UpdateReportStatusDTO';

export interface ReportsRepository {
  /**
   * Cria uma nova denúncia com todas as entidades relacionadas
   */
  create(data: CreateReport): Promise<string>;

  /**
   * Busca uma denúncia por ID com todos os dados relacionados
   */
  findById(id: string): Promise<ReportResponse | null>;

  /**
   * Lista denúncias com paginação (versão resumida)
   */
  findMany(options: FindManyReportsOptionsDTO): Promise<{
    reports: ReportSummaryResponse[];
    total: number;
  }>;

  /**
   * Atualiza o status de uma denúncia
   */
  updateStatus(id: string, data: UpdateReportStatus): Promise<void>;

  /**
   * Verifica se uma denúncia existe
   */
  exists(id: string): Promise<boolean>;

  /**
   * Busca clube por nome (para verificar se já existe)
   */
  findClubeByName(name: string): Promise<{ id: string; nomeClube: string } | null>;
}
