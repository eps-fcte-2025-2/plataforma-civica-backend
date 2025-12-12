import type { TypedRequest, TypedResponse } from '../../../../src/shared/patterns/Controller';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GetReportsController } from '../../../../src/modules/reports/controllers/GetReportsController';
import { ReportsFactory } from '../../../factories/ReportsFactory';
import type { ReportsListResponseSchemaType } from '../../../../src/modules/reports/dtos/ReportResponseDTO';
import { buildGetReportsUseCase } from '../../../../src/modules/reports/factories/ReportsUseCaseFactory';

// Mock do buildGetReportsUseCase
vi.mock('../../../../src/modules/reports/factories/ReportsUseCaseFactory', () => ({
  buildGetReportsUseCase: vi.fn(),
}));


describe('GetReportsController', () => {
  let controller: GetReportsController;
  let mockRequest: TypedRequest<any, any, any>;
  let mockResponse: TypedResponse<{ 200: ReportsListResponseSchemaType }>;
  let mockUseCase: any;

  beforeEach(() => {
    // Limpar mocks
    vi.clearAllMocks();

    controller = new GetReportsController();

    // Mock do use case
    mockUseCase = {
      execute: vi.fn(),
    };
    (buildGetReportsUseCase as any).mockReturnValue(mockUseCase);

    // Mock da request
    mockRequest = {
      query: {},
      params: {},
      body: {},
    } as any;

    // Mock da response
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as any;
  });

  describe('Extração de parâmetros', () => {
    it('deve extrair page e pageSize da query', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 2,
        pageSize: 20,
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 2,
        pageSize: 20,
        filters: {},
      });
    });

    it('deve extrair filtros da query', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 1,
        pageSize: 10,
        tipoDenuncia: 'PARTIDA_ESPECIFICA',
        uf: 'SP',
        municipio: 'São Paulo',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {
          tipoDenuncia: 'PARTIDA_ESPECIFICA',
          uf: 'SP',
          municipio: 'São Paulo',
        },
      });
    });

    it('deve extrair filtros de frequência e pontualOuDisseminado', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 1,
        pageSize: 10,
        frequencia: 'FREQUENTE',
        pontualOuDisseminado: 'DISSEMINADO',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {
          frequencia: 'FREQUENTE',
          pontualOuDisseminado: 'DISSEMINADO',
        },
      });
    });

    it('deve extrair filtros de data', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 1,
        pageSize: 10,
        dataInicio: '2024-01-01T00:00:00.000Z',
        dataFim: '2024-12-31T23:59:59.999Z',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {
          dataInicio: '2024-01-01T00:00:00.000Z',
          dataFim: '2024-12-31T23:59:59.999Z',
        },
      });
    });

    it('deve extrair termo de busca', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 1,
        pageSize: 10,
        termoBusca: 'manipulação',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {
          termoBusca: 'manipulação',
        },
      });
    });

    it('deve separar corretamente page/pageSize dos demais filtros', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 3,
        pageSize: 25,
        tipoDenuncia: 'ESQUEMA_DE_MANIPULACAO',
        uf: 'RJ',
        frequencia: 'ISOLADO',
        municipio: 'Rio de Janeiro',
        termoBusca: 'apostas',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 3,
        pageSize: 25,
        filters: {
          tipoDenuncia: 'ESQUEMA_DE_MANIPULACAO',
          uf: 'RJ',
          frequencia: 'ISOLADO',
          municipio: 'Rio de Janeiro',
          termoBusca: 'apostas',
        },
      });
    });

    it('deve passar filtros vazios quando apenas page e pageSize são fornecidos', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 1,
        pageSize: 10,
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        filters: {},
      });
    });
  });

  describe('Chamada do Use Case', () => {
    it('deve chamar buildGetReportsUseCase para obter o use case', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = { page: 1, pageSize: 10 };

      await controller.handle(mockRequest, mockResponse);

      expect(buildGetReportsUseCase).toHaveBeenCalledTimes(1);
    });

    it('deve executar o use case com os parâmetros corretos', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 2,
        pageSize: 20,
        uf: 'SP',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 2,
        pageSize: 20,
        filters: { uf: 'SP' },
      });
    });
  });

  describe('Resposta', () => {
    it('deve retornar status 200 com os dados do use case', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = { page: 1, pageSize: 10 };

      await controller.handle(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockResult);
    });

    it('deve retornar lista vazia quando não há relatórios', async () => {
      const emptyResult = ReportsFactory.createReportsList({
        reports: [],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      });
      mockUseCase.execute.mockResolvedValue(emptyResult);

      mockRequest.query = { page: 1, pageSize: 10 };

      await controller.handle(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(emptyResult);
    });

    it('deve retornar dados de paginação corretos', async () => {
      const mockResult = ReportsFactory.createReportsList({
        pagination: {
          page: 2,
          pageSize: 20,
          total: 50,
          totalPages: 3,
        },
      });
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = { page: 2, pageSize: 20 };

      await controller.handle(mockRequest, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: {
            page: 2,
            pageSize: 20,
            total: 50,
            totalPages: 3,
          },
        })
      );
    });

    it('deve retornar lista de relatórios com estrutura correta', async () => {
      const mockReports = [
        ReportsFactory.createReportSummary(),
        ReportsFactory.createReportSummary({
          id: '456',
          tipoDenuncia: 'ESQUEMA_DE_MANIPULACAO',
        }),
      ];

      const mockResult = ReportsFactory.createReportsList({
        reports: mockReports,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 2,
          totalPages: 1,
        },
      });

      mockUseCase.execute.mockResolvedValue(mockResult);
      mockRequest.query = { page: 1, pageSize: 10 };

      await controller.handle(mockRequest, mockResponse);

      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.objectContaining({
          reports: expect.arrayContaining([
            expect.objectContaining({ id: expect.any(String) }),
          ]),
        })
      );
    });
  });

  describe('Tratamento de erros', () => {
    it('deve propagar erro do use case', async () => {
      const error = new Error('Erro no use case');
      mockUseCase.execute.mockRejectedValue(error);

      mockRequest.query = { page: 1, pageSize: 10 };

      await expect(controller.handle(mockRequest, mockResponse)).rejects.toThrow(
        'Erro no use case'
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('deve propagar erro de validação do use case', async () => {
      const validationError = new Error('Parâmetros inválidos');
      mockUseCase.execute.mockRejectedValue(validationError);

      mockRequest.query = { page: -1, pageSize: 10 };

      await expect(controller.handle(mockRequest, mockResponse)).rejects.toThrow(
        'Parâmetros inválidos'
      );
    });

    it('deve propagar erro do repositório através do use case', async () => {
      const dbError = new Error('Erro no banco de dados');
      mockUseCase.execute.mockRejectedValue(dbError);

      mockRequest.query = { page: 1, pageSize: 10 };

      await expect(controller.handle(mockRequest, mockResponse)).rejects.toThrow(
        'Erro no banco de dados'
      );
    });
  });

  describe('Integração controller-usecase', () => {
    it('deve processar requisição completa com múltiplos filtros', async () => {
      const mockResult = ReportsFactory.createReportsList();
      mockUseCase.execute.mockResolvedValue(mockResult);

      mockRequest.query = {
        page: 1,
        pageSize: 50,
        tipoDenuncia: 'PARTIDA_ESPECIFICA',
        frequencia: 'FREQUENTE',
        pontualOuDisseminado: 'DISSEMINADO',
        uf: 'MG',
        municipio: 'Belo Horizonte',
        dataInicio: '2024-01-01T00:00:00.000Z',
        dataFim: '2024-06-30T23:59:59.999Z',
        termoBusca: 'futebol',
      };

      await controller.handle(mockRequest, mockResponse);

      expect(buildGetReportsUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 50,
        filters: {
          tipoDenuncia: 'PARTIDA_ESPECIFICA',
          frequencia: 'FREQUENTE',
          pontualOuDisseminado: 'DISSEMINADO',
          uf: 'MG',
          municipio: 'Belo Horizonte',
          dataInicio: '2024-01-01T00:00:00.000Z',
          dataFim: '2024-06-30T23:59:59.999Z',
          termoBusca: 'futebol',
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockResult);
    });
  });
});
