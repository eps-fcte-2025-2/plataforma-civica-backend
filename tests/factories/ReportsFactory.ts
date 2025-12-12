import type { ReportSummaryResponse, ReportsListResponse } from '../../src/modules/reports/dtos/ReportResponseDTO';

import type { ReportsRepository } from '../../src/modules/reports/repositories/ReportsRepository';
import { vi } from 'vitest';

export class ReportsFactory {
  static createReportSummary(overrides?: Partial<ReportSummaryResponse>): ReportSummaryResponse {
    const defaultReport: ReportSummaryResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      tipoDenuncia: 'PARTIDA_ESPECIFICA',
      descricao: 'Denúncia de manipulação de resultado em partida',
      pontualOuDisseminado: 'PONTUAL',
      frequencia: 'ISOLADO',
      dataDenuncia: '2024-01-01T10:00:00.000Z',
      municipio: 'São Paulo',
      uf: 'SP',
      totalPessoas: 3,
      totalClubes: 2,
      totalEvidencias: 5,
    };

    return { ...defaultReport, ...overrides };
  }

  static createReportsList(overrides?: Partial<ReportsListResponse>): ReportsListResponse {
    const defaultList: ReportsListResponse = {
      reports: [
        ReportsFactory.createReportSummary(),
        ReportsFactory.createReportSummary({
          id: '223e4567-e89b-12d3-a456-426614174001',
          tipoDenuncia: 'ESQUEMA_DE_MANIPULACAO',
          descricao: 'Esquema de apostas ilegais',
          municipio: 'Rio de Janeiro',
          uf: 'RJ',
        }),
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      },
    };

    return { ...defaultList, ...overrides };
  }

  static createReportsRepositoryMock(): ReportsRepository {
    return {
      create: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
      updateStatus: vi.fn(),
      exists: vi.fn(),
      findClubeByName: vi.fn(),
    };
  }
}
