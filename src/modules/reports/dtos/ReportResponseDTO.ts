import z from "zod";

// Schema para Pessoa na resposta
export const PessoaResponseSchema = z.object({
    id: z.string().uuid(),
    nomePessoa: z.string(),
    funcaoPessoa: z.string()
});

// Schema para Clube na resposta
export const ClubeResponseSchema = z.object({
    id: z.string().uuid(),
    nomeClube: z.string()
});

// Schema para Município na resposta
export const MunicipioResponseSchema = z.object({
    id: z.string().uuid(),
    nome: z.string(),
    uf: z.string()
});

// Schema para Partida na resposta
export const PartidaResponseSchema = z.object({
    id: z.string().uuid(),
    torneio: z.string(),
    dataPartida: z.string().datetime(),
    localPartida: z.string(),
    timeA: z.string().nullable(),
    timeB: z.string().nullable(),
    observacoes: z.string().nullable(),
    municipio: z.string(),
    uf: z.string()
});

// Schema para Foco de Manipulação na resposta
export const DenunciaFocoResponseSchema = z.object({
    id: z.string().uuid(),
    foco: z.enum(["ATLETAS_DIRIGENTES_COMISSAO", "APOSTADORES", "JUIZES"])
});

// Schema para Evidência na resposta
export const EvidenciaResponseSchema = z.object({
    id: z.string().uuid(),
    nomeOriginal: z.string(),
    nomeArquivo: z.string(),
    caminhoArquivo: z.string(),
    tamanhoBytes: z.number(),
    mimeType: z.string(),
    tipo: z.enum(["DOCUMENTO", "IMAGEM", "VIDEO", "AUDIO", "OUTRO"]),
    descricao: z.string().nullable(),
    dataUpload: z.string().datetime()
});

// Schema para resposta completa de uma denúncia
export const ReportResponseSchema = z.object({
    id: z.string().uuid(),
    tipoDenuncia: z.enum(["PARTIDA_ESPECIFICA", "ESQUEMA_DE_MANIPULACAO"]),
    descricao: z.string(),
    comoSoube: z.enum(["VITIMA", "TERCEIROS", "INTERNET", "PRESENCIAL", "OBSERVACAO", "OUTROS"]).nullable(),
    pontualOuDisseminado: z.enum(["PONTUAL", "DISSEMINADO"]),
    frequencia: z.enum(["ISOLADO", "FREQUENTE"]),
    dataDenuncia: z.string().datetime(),
    municipio: z.string(),
    uf: z.string(),
    pessoasEnvolvidas: z.array(PessoaResponseSchema),
    clubesEnvolvidos: z.array(ClubeResponseSchema),
    focosManipulacao: z.array(DenunciaFocoResponseSchema),
    evidencias: z.array(EvidenciaResponseSchema),
    partidas: z.array(PartidaResponseSchema)
});

// Schema para resposta resumida de uma denúncia (para listagem)
export const ReportSummaryResponseSchema = z.object({
    id: z.string().uuid(),
    tipoDenuncia: z.enum(["PARTIDA_ESPECIFICA", "ESQUEMA_DE_MANIPULACAO"]),
    descricao: z.string().max(200), // Descrição truncada
    pontualOuDisseminado: z.enum(["PONTUAL", "DISSEMINADO"]),
    frequencia: z.enum(["ISOLADO", "FREQUENTE"]),
    dataDenuncia: z.string().datetime(),
    municipio: z.string(),
    uf: z.string(),
    totalPessoas: z.number(),
    totalClubes: z.number(),
    totalEvidencias: z.number()
});

// Schema para resposta paginada de denúncias
export const ReportsListResponseSchema = z.object({
    reports: z.array(ReportSummaryResponseSchema),
    pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number()
    })
});

// Schema para resposta de criação de denúncia
export const CreateReportResponseSchema = z.object({
    id: z.string().uuid(),
    message: z.string(),
    createdAt: z.string().datetime()
});

export type ReportResponseSchemaType = typeof ReportResponseSchema;
export type ReportSummaryResponseSchemaType = typeof ReportSummaryResponseSchema;
export type ReportsListResponseSchemaType = typeof ReportsListResponseSchema;
export type CreateReportResponseSchemaType = typeof CreateReportResponseSchema;

export type ReportResponse = z.infer<typeof ReportResponseSchema>;
export type ReportSummaryResponse = z.infer<typeof ReportSummaryResponseSchema>;
export type ReportsListResponse = z.infer<typeof ReportsListResponseSchema>;
export type CreateReportResponse = z.infer<typeof CreateReportResponseSchema>;