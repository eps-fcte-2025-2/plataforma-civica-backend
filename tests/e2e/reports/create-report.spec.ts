import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { FastifyInstance } from 'fastify';
import { app as realApp } from '../../../src/infra/http/app'; 
import { CreateReportSchemaType } from '../../../src/modules/reports/dtos/CreateReportDTO';
import { webcrypto as crypto } from 'crypto';
import z from 'zod'; 

const inMemoryDatabase = {
    reports: [],
};

const fakePrismaClient = {
    denuncia: {
        create: vi.fn(async (args) => {
            const newReport = {
                id: crypto.randomUUID(),
                ...args.data,
                dataDenuncia: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            inMemoryDatabase.reports = [newReport]; 
            return newReport; 
        }),
    },
    pessoa: {
        create: vi.fn(async (args) => {
            return { id: crypto.randomUUID(), ...args.data };
        })
    },
    clube: {
        findFirst: vi.fn(async () => null), 
        create: vi.fn(async (args) => {
            return { id: crypto.randomUUID(), ...args.data };
        }),
        update: vi.fn(async (args) => {
            return { id: args.where.id, ...args.data };
        })
    },
    denunciaFoco: {
         create: vi.fn(async (args) => {
            return { id: crypto.randomUUID(), ...args.data };
        })
    },
    evidencia: {
        create: vi.fn(async (args) => {
            return { id: crypto.randomUUID(), ...args.data };
        })
    },
    partida: {
         create: vi.fn(async (args) => {
            return { id: crypto.randomUUID(), ...args.data };
        })
    },
    $transaction: vi.fn(async (callback) => {
        return await callback(fakePrismaClient);
    }),
};


vi.mock('../../../src/infra/database/DatabaseConnection', () => {
  return {
    DatabaseConnection: {
      getConnection: () => {
        return fakePrismaClient; 
      },
    },
  };
});


describe('E2E: POST /v1/reports', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = realApp; 
        await app.ready();
    });

    afterAll(async () => {
        vi.clearAllMocks();
        inMemoryDatabase.reports = [];
        await app.close();
    });

    it('deve criar uma nova denúncia (Critério de Aceite)', async () => { 
        // Payload válido
        const payload: CreateReportSchemaType = {
            tipoDenuncia: "ESQUEMA_DE_MANIPULACAO",
            descricao: "Este é um teste e2e de denúncia com mais de 10 caracteres.",
            municipio: "São Paulo",
            uf: "SP",
            pessoasEnvolvidas: [
                { nomePessoa: "Pessoa Envolvida 5555", funcaoPessoa: "Jogador" }
            ],
            clubesEnvolvidos: [
                { nomeClube: "Clube Teste FC" }
            ],
            focosManipulacao: ["ATLETAS_DIRIGENTES_COMISSAO"],
            comoSoube: "INTERNET",
            evidencias: [
                {
                    nomeOriginal: "evidence.png",
                    nomeArquivo: "file-xyz.png",
                    caminhoArquivo: "uploads/file-xyz.png",
                    tamanhoBytes: 123456,
                    mimeType: "image/png",
                    tipo: "IMAGEM"
                }
            ],
        };

        const response = await app.inject({
            method: 'POST',
            url: '/v1/reports',
            payload: payload,
        });

        expect(response.statusCode).toBe(200); 

        const responseBody = response.json();

        expect(responseBody).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                message: expect.any(String),
                createdAt: expect.any(String),
            })
        );

        expect(z.string().uuid().safeParse(responseBody.id).success).toBe(true);
        expect(fakePrismaClient.denuncia.create).toHaveBeenCalledOnce();
        expect(fakePrismaClient.pessoa.create).toHaveBeenCalledOnce();
        expect(fakePrismaClient.clube.findFirst).toHaveBeenCalledOnce(); 
        expect(fakePrismaClient.clube.create).toHaveBeenCalledOnce(); 
        expect(fakePrismaClient.denunciaFoco.create).toHaveBeenCalledOnce();
        expect(fakePrismaClient.evidencia.create).toHaveBeenCalledOnce();

    }, 10000);

    it('deve retornar 422 para payload inválido (Critério de Aceite)', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/v1/reports',
            payload: {
                report: { description: 'Payload incompleto' } // Payload inválido
            },
        });

        expect(response.statusCode).toBe(422); 
        expect(response.json()).toHaveProperty('issues');
    });
});