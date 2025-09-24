import { PrismaClient } from "../../../../../generated/prisma";
import { DatabaseConnection } from "../../../../infra/database/DatabaseConnection";
import { CreateReport } from "../../dtos/CreateReportDTO";
import { UpdateReportStatus } from "../../dtos/UpdateReportStatusDTO";
import { ReportResponse, ReportSummaryResponse } from "../../dtos/ReportResponseDTO";
import { ReportsRepository } from "../../repositories/ReportsRepository";

export class ReportsRepositoryImpl implements ReportsRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = DatabaseConnection.getConnection();
    }

    async create(data: CreateReport): Promise<string> {
        return this.prisma.$transaction(async (tx) => {
            // 1. Criar a denúncia principal
            const denuncia = await tx.denuncia.create({
                data: {
                    tipoDenuncia: data.tipoDenuncia,
                    descricao: data.descricao,
                    comoSoube: data.comoSoube,
                    pontualOuDisseminado: data.pontualOuDisseminado,
                    frequencia: data.frequencia,
                    municipioId: data.municipioId,
                },
            });

            // 2. Criar pessoas envolvidas
            await Promise.all(
                data.pessoasEnvolvidas.map((pessoa) =>
                    tx.pessoa.create({
                        data: {
                            nomePessoa: pessoa.nomePessoa,
                            funcaoPessoa: pessoa.funcaoPessoa,
                            denunciaId: denuncia.id,
                        },
                    })
                )
            );

            // 3. Criar/vincular clubes envolvidos
            for (const clubeData of data.clubesEnvolvidos) {
                // Verificar se clube já existe
                const existingClube = await tx.clube.findFirst({
                    where: {
                        nomeClube: clubeData.nomeClube,
                    },
                });

                if (existingClube) {
                    // Atualizar clube existente para vincular à denúncia
                    await tx.clube.update({
                        where: { id: existingClube.id },
                        data: { denunciaId: denuncia.id },
                    });
                } else {
                    // Criar novo clube
                    await tx.clube.create({
                        data: {
                            nomeClube: clubeData.nomeClube,
                            denunciaId: denuncia.id,
                        },
                    });
                }
            }

            // 4. Criar focos de manipulação
            await Promise.all(
                data.focosManipulacao.map((foco) =>
                    tx.denunciaFoco.create({
                        data: {
                            denunciaId: denuncia.id,
                            foco: foco,
                        },
                    })
                )
            );

            // 5. Criar evidências
            if (data.evidencias.length > 0) {
                await Promise.all(
                    data.evidencias.map((evidencia) =>
                        tx.evidencia.create({
                            data: {
                                nomeOriginal: evidencia.nomeOriginal,
                                nomeArquivo: evidencia.nomeArquivo,
                                caminhoArquivo: evidencia.caminhoArquivo,
                                tamanhoBytes: evidencia.tamanhoBytes,
                                mimeType: evidencia.mimeType,
                                tipo: evidencia.tipo,
                                descricao: evidencia.descricao,
                                denunciaId: denuncia.id,
                            },
                        })
                    )
                );
            }

            // 6. Criar partidas (se for PARTIDA_ESPECIFICA)
            if (data.tipoDenuncia === "PARTIDA_ESPECIFICA" && data.partidas.length > 0) {
                await Promise.all(
                    data.partidas.map((partida) =>
                        tx.partida.create({
                            data: {
                                torneio: partida.torneio,
                                dataPartida: new Date(partida.dataPartida),
                                localPartida: partida.localPartida,
                                timeA: partida.timeA,
                                timeB: partida.timeB,
                                observacoes: partida.observacoes,
                                denunciaId: denuncia.id,
                                municipioId: partida.municipioId,
                            },
                        })
                    )
                );
            }

            return denuncia.id;
        });
    }

    async findById(id: string): Promise<ReportResponse | null> {
        const denuncia = await this.prisma.denuncia.findUnique({
            where: { id },
            include: {
                municipio: true,
                pessoasEnvolvidas: true,
                clubesEnvolvidos: true,
                focosManipulacao: true,
                evidencias: true,
                partidas: {
                    include: {
                        municipio: true,
                    },
                },
            },
        });

        if (!denuncia) {
            return null;
        }

        return {
            id: denuncia.id,
            tipoDenuncia: denuncia.tipoDenuncia,
            descricao: denuncia.descricao,
            comoSoube: denuncia.comoSoube,
            pontualOuDisseminado: denuncia.pontualOuDisseminado,
            frequencia: denuncia.frequencia,
            dataDenuncia: denuncia.dataDenuncia.toISOString(),
            municipio: {
                id: denuncia.municipio.id,
                nome: denuncia.municipio.nome,
                uf: denuncia.municipio.uf,
            },
            pessoasEnvolvidas: denuncia.pessoasEnvolvidas.map((pessoa) => ({
                id: pessoa.id,
                nomePessoa: pessoa.nomePessoa,
                funcaoPessoa: pessoa.funcaoPessoa,
            })),
            clubesEnvolvidos: denuncia.clubesEnvolvidos.map((clube) => ({
                id: clube.id,
                nomeClube: clube.nomeClube,
            })),
            focosManipulacao: denuncia.focosManipulacao.map((foco) => ({
                id: foco.id,
                foco: foco.foco,
            })),
            evidencias: denuncia.evidencias.map((evidencia) => ({
                id: evidencia.id,
                nomeOriginal: evidencia.nomeOriginal,
                nomeArquivo: evidencia.nomeArquivo,
                caminhoArquivo: evidencia.caminhoArquivo,
                tamanhoBytes: evidencia.tamanhoBytes,
                mimeType: evidencia.mimeType,
                tipo: evidencia.tipo,
                descricao: evidencia.descricao,
                dataUpload: evidencia.dataUpload.toISOString(),
            })),
            partidas: denuncia.partidas.map((partida) => ({
                id: partida.id,
                torneio: partida.torneio,
                dataPartida: partida.dataPartida.toISOString(),
                localPartida: partida.localPartida,
                timeA: partida.timeA,
                timeB: partida.timeB,
                observacoes: partida.observacoes,
                municipio: {
                    id: partida.municipio.id,
                    nome: partida.municipio.nome,
                    uf: partida.municipio.uf,
                },
            })),
        };
    }

    async findMany(page: number, pageSize: number): Promise<{
        reports: ReportSummaryResponse[];
        total: number;
    }> {
        const skip = (page - 1) * pageSize;

        const [denuncias, total] = await Promise.all([
            this.prisma.denuncia.findMany({
                skip,
                take: pageSize,
                include: {
                    municipio: true,
                    pessoasEnvolvidas: true,
                    clubesEnvolvidos: true,
                    evidencias: true,
                },
                orderBy: {
                    dataDenuncia: "desc",
                },
            }),
            this.prisma.denuncia.count(),
        ]);

        const reports = denuncias.map((denuncia) => ({
            id: denuncia.id,
            tipoDenuncia: denuncia.tipoDenuncia,
            descricao: denuncia.descricao.substring(0, 200),
            pontualOuDisseminado: denuncia.pontualOuDisseminado,
            frequencia: denuncia.frequencia,
            dataDenuncia: denuncia.dataDenuncia.toISOString(),
            municipio: {
                id: denuncia.municipio.id,
                nome: denuncia.municipio.nome,
                uf: denuncia.municipio.uf,
            },
            totalPessoas: denuncia.pessoasEnvolvidas.length,
            totalClubes: denuncia.clubesEnvolvidos.length,
            totalEvidencias: denuncia.evidencias.length,
        }));

        return { reports, total };
    }

    async updateStatus(id: string, data: UpdateReportStatus): Promise<void> {
        // Note: Como não temos campo de status no schema atual, 
        // vamos adicionar este campo posteriormente ou usar outra estratégia
        // Por ora, vamos apenas verificar se a denúncia existe
        const denuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        });

        if (!denuncia) {
            throw new Error("Denúncia não encontrada");
        }

        // TODO: Implementar quando campo de status for adicionado ao schema
        console.log(`Status da denúncia ${id} seria atualizado para: ${data.status}`);
    }

    async exists(id: string): Promise<boolean> {
        const denuncia = await this.prisma.denuncia.findUnique({
            where: { id },
        });

        return !!denuncia;
    }

    async findClubeByName(name: string): Promise<{ id: string; nomeClube: string } | null> {
        const clube = await this.prisma.clube.findFirst({
            where: {
                nomeClube: name,
            },
        });

        return clube ? { id: clube.id, nomeClube: clube.nomeClube } : null;
    }

    async municipioExists(municipioId: string): Promise<boolean> {
        const municipio = await this.prisma.municipio.findUnique({
            where: { id: municipioId },
        });

        return !!municipio;
    }
}