import { PrismaClient } from "../../../../../generated/prisma";
import { DatabaseConnection } from "../../../../infra/database/DatabaseConnection";
import { DashboardMetricsResponse } from "../../dtos/DashboardMetricsDTO";
import { PublicRepository } from "../../repositories/PublicRepository";

export class PublicRepositoryImpl implements PublicRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = DatabaseConnection.getConnection();
    }

    async getDashboardMetrics(): Promise<DashboardMetricsResponse> {
        // Buscar métricas básicas
        const [
            totalDenuncias,
            denunciasPorStatus,
            denunciasPorTipo,
            denunciasPorRegiao,
            dadosParaMapa,
            evolucaoTemporal
        ] = await Promise.all([
            // Total de denúncias
            this.prisma.denuncia.count(),

            // Denúncias por status
            this.prisma.denuncia.groupBy({
                by: ['status'],
                _count: {
                    id: true
                }
            }),

            // Denúncias por tipo
            this.prisma.denuncia.groupBy({
                by: ['tipoDenuncia'],
                _count: {
                    id: true
                }
            }),

            // Denúncias por região (UF)
            this.prisma.denuncia.groupBy({
                by: ['uf'],
                _count: {
                    id: true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                }
            }),

            // Dados para o mapa (município + UF)
            this.prisma.denuncia.groupBy({
                by: ['municipio', 'uf'],
                _count: {
                    id: true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                }
            }),

            // Evolução temporal (últimos 12 meses)
            this.prisma.$queryRaw<Array<{ periodo: string; total: bigint }>>`
                SELECT 
                    TO_CHAR(DATE_TRUNC('month', "dataDenuncia"), 'YYYY-MM') as periodo,
                    COUNT(*) as total
                FROM "Denuncia"
                WHERE "dataDenuncia" >= NOW() - INTERVAL '12 months'
                GROUP BY DATE_TRUNC('month', "dataDenuncia")
                ORDER BY DATE_TRUNC('month', "dataDenuncia") ASC
            `
        ]);

        // Processar dados para o formato esperado
        const statusCounts = {
            pendentes: 0,
            emAnalise: 0,
            aprovadas: 0,
            rejeitadas: 0,
            arquivadas: 0
        };

        denunciasPorStatus.forEach(item => {
            switch (item.status) {
                case 'PENDENTE':
                    statusCounts.pendentes = item._count.id;
                    break;
                case 'EM_ANALISE':
                    statusCounts.emAnalise = item._count.id;
                    break;
                case 'APROVADA':
                    statusCounts.aprovadas = item._count.id;
                    break;
                case 'REJEITADA':
                    statusCounts.rejeitadas = item._count.id;
                    break;
                case 'ARQUIVADA':
                    statusCounts.arquivadas = item._count.id;
                    break;
            }
        });

        const tipoCounts = {
            partidaEspecifica: 0,
            esquemaManipulacao: 0
        };

        denunciasPorTipo.forEach(item => {
            switch (item.tipoDenuncia) {
                case 'PARTIDA_ESPECIFICA':
                    tipoCounts.partidaEspecifica = item._count.id;
                    break;
                case 'ESQUEMA_DE_MANIPULACAO':
                    tipoCounts.esquemaManipulacao = item._count.id;
                    break;
            }
        });

        return {
            totalDenuncias,
            denunciasPorStatus: statusCounts,
            denunciasPorTipo: tipoCounts,
            denunciasPorRegiao: denunciasPorRegiao.map(item => ({
                uf: item.uf,
                total: item._count.id
            })),
            dadosParaMapa: dadosParaMapa.map(item => ({
                municipio: item.municipio,
                uf: item.uf,
                total: item._count.id
            })),
            evolucaoTemporal: evolucaoTemporal.map(item => ({
                periodo: item.periodo,
                total: Number(item.total)
            }))
        };
    }
}