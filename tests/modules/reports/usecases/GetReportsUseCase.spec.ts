import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetReportsUseCase } from '../../../../src/modules/reports/usecases/GetReportsUseCase';
import { ReportsFactory } from '../../../factories/ReportsFactory';
import type { ReportsRepository } from '../../../../src/modules/reports/repositories/ReportsRepository';

describe('GetReportsUseCase', () => {
  let mockReportsRepository: ReportsRepository;
  let useCase: GetReportsUseCase;

  beforeEach(() => {
    mockReportsRepository = ReportsFactory.createReportsRepositoryMock();
    useCase = new GetReportsUseCase(mockReportsRepository);
  });

  describe('Paginação', () => {
    it('deve retornar relatórios com paginação padrão quando não especificada', async () => {
      const mockReports = [ReportsFactory.createReportSummary()];
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: mockReports,
        total: 1,
      });

      const result = await useCase.execute({
        page: undefined as any,
        pageSize: undefined as any,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {},
      });
      expect(result.reports).toEqual(mockReports);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('deve validar e usar parâmetros de paginação fornecidos', async () => {
      const mockReports = [ReportsFactory.createReportSummary()];
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: mockReports,
        total: 50,
      });

      const result = await useCase.execute({
        page: 2,
        pageSize: 20,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 2,
        pageSize: 20,
        filters: {},
      });
      expect(result.pagination).toEqual({
        page: 2,
        pageSize: 20,
        total: 50,
        totalPages: 3,
      });
    });

    it('deve garantir que page seja no mínimo 1', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 0,
        pageSize: 10,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {},
      });
    });

    it('deve garantir que page seja no mínimo 1 quando negativo', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: -5,
        pageSize: 10,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {},
      });
    });

    it('deve usar pageSize padrão 10 quando pageSize for 0', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 0,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {},
      });
    });

    it('deve garantir que pageSize seja no mínimo 1 quando negativo', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: -5,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 1,
        filters: {},
      });
    });

    it('deve limitar pageSize ao máximo de 100', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 150,
        filters: {},
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 100,
        filters: {},
      });
    });

    it('deve calcular totalPages corretamente', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 25,
      });

      const result = await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: {},
      });

      expect(result.pagination.totalPages).toBe(3);
    });

    it('deve retornar totalPages = 0 quando não há relatórios', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      const result = await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: {},
      });

      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('Filtros', () => {
    it('deve passar filtros vazios quando não especificados', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: undefined as any,
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {},
      });
    });

    it('deve passar filtros de tipoDenuncia para o repositório', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: { tipoDenuncia: 'PARTIDA_ESPECIFICA' },
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: { tipoDenuncia: 'PARTIDA_ESPECIFICA' },
      });
    });

    it('deve passar filtros de localização (uf e município) para o repositório', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: { uf: 'SP', municipio: 'São Paulo' },
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: { uf: 'SP', municipio: 'São Paulo' },
      });
    });

    it('deve passar filtros de data para o repositório', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: {
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
        },
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
        },
      });
    });

    it('deve passar filtro de termo de busca para o repositório', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: { termoBusca: 'manipulação' },
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: { termoBusca: 'manipulação' },
      });
    });

    it('deve passar múltiplos filtros combinados para o repositório', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: {
          tipoDenuncia: 'ESQUEMA_DE_MANIPULACAO',
          uf: 'RJ',
          frequencia: 'FREQUENTE',
          pontualOuDisseminado: 'DISSEMINADO',
        },
      });

      expect(mockReportsRepository.findMany).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {
          tipoDenuncia: 'ESQUEMA_DE_MANIPULACAO',
          uf: 'RJ',
          frequencia: 'FREQUENTE',
          pontualOuDisseminado: 'DISSEMINADO',
        },
      });
    });
  });

  describe('Resposta', () => {
    it('deve retornar lista de relatórios formatada corretamente', async () => {
      const mockReports = [
        ReportsFactory.createReportSummary(),
        ReportsFactory.createReportSummary({ id: '456' }),
      ];
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: mockReports,
        total: 2,
      });

      const result = await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: {},
      });

      expect(result.reports).toEqual(mockReports);
      expect(result.reports).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('deve retornar lista vazia quando não há relatórios', async () => {
      mockReportsRepository.findMany = vi.fn().mockResolvedValue({
        reports: [],
        total: 0,
      });

      const result = await useCase.execute({
        page: 1,
        pageSize: 10,
        filters: {},
      });

      expect(result.reports).toEqual([]);
      expect(result.reports).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('Erros', () => {
    it('deve propagar erro quando o repositório falhar', async () => {
      const error = new Error('Erro no banco de dados');
      mockReportsRepository.findMany = vi.fn().mockRejectedValue(error);

      await expect(
        useCase.execute({
          page: 1,
          pageSize: 10,
          filters: {},
        })
      ).rejects.toThrow('Erro no banco de dados');

      expect(mockReportsRepository.findMany).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conexão do repositório', async () => {
      const connectionError = new Error('Falha na conexão com o banco');
      mockReportsRepository.findMany = vi.fn().mockRejectedValue(connectionError);

      await expect(
        useCase.execute({
          page: 1,
          pageSize: 10,
          filters: {},
        })
      ).rejects.toThrow('Falha na conexão com o banco');
    });
  });
});
