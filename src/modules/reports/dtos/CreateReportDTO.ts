import z from "zod";

// Enums do Prisma
export const TipoDenunciaEnum = z.enum(["PARTIDA_ESPECIFICA", "ESQUEMA_DE_MANIPULACAO"]);
export const ComoSoubeEnum = z.enum(["VITIMA", "TERCEIROS", "INTERNET", "PRESENCIAL", "OBSERVACAO", "OUTROS"]);
export const PontualOuDisseminadoEnum = z.enum(["PONTUAL", "DISSEMINADO"]);
export const FrequenciaEnum = z.enum(["ISOLADO", "FREQUENTE"]);
export const FocoManipulacaoEnum = z.enum(["ATLETAS_DIRIGENTES_COMISSAO", "APOSTADORES", "JUIZES"]);
export const TipoEvidenciaEnum = z.enum(["DOCUMENTO", "IMAGEM", "VIDEO", "AUDIO", "OUTRO"]);

// DTO para Pessoa Envolvida
export const PessoaEnvolvidaSchema = z.object({
    nomePessoa: z.string().min(1, "Nome da pessoa é obrigatório").max(255),
    funcaoPessoa: z.string().min(1, "Função da pessoa é obrigatória").max(255)
});

// DTO para Clube Envolvido
export const ClubeEnvolvidoSchema = z.object({
    nomeClube: z.string().min(1, "Nome do clube é obrigatório").max(255)
});

// DTO para Partida (quando tipo de denúncia for PARTIDA_ESPECIFICA)
export const PartidaSchema = z.object({
    torneio: z.string().min(1, "Nome do torneio é obrigatório").max(255),
    dataPartida: z.string().datetime("Data da partida deve estar no formato ISO 8601"),
    localPartida: z.string().min(1, "Local da partida é obrigatório").max(255),
    timeA: z.string().max(255).optional(),
    timeB: z.string().max(255).optional(),
    observacoes: z.string().max(1000).optional(),
    municipioId: z.string().uuid("ID do município deve ser um UUID válido")
});

// DTO para Evidência
export const EvidenciaSchema = z.object({
    nomeOriginal: z.string().min(1, "Nome original do arquivo é obrigatório"),
    nomeArquivo: z.string().min(1, "Nome do arquivo é obrigatório"),
    caminhoArquivo: z.string().min(1, "Caminho do arquivo é obrigatório"),
    tamanhoBytes: z.number().positive("Tamanho deve ser positivo"),
    mimeType: z.string().min(1, "Tipo MIME é obrigatório"),
    tipo: TipoEvidenciaEnum,
    descricao: z.string().max(500).optional()
});

// DTO principal para criar denúncia
export const CreateReportSchema = z.object({
    tipoDenuncia: TipoDenunciaEnum,
    descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(5000),
    comoSoube: ComoSoubeEnum.optional(),
    pontualOuDisseminado: PontualOuDisseminadoEnum.default("PONTUAL"),
    frequencia: FrequenciaEnum.default("ISOLADO"),
    municipioId: z.string().uuid("ID do município deve ser um UUID válido"),
    
    // Relacionamentos
    pessoasEnvolvidas: z.array(PessoaEnvolvidaSchema).min(1, "Pelo menos uma pessoa deve estar envolvida"),
    clubesEnvolvidos: z.array(ClubeEnvolvidoSchema).optional().default([]),
    focosManipulacao: z.array(FocoManipulacaoEnum).min(1, "Pelo menos um foco de manipulação deve ser selecionado"),
    evidencias: z.array(EvidenciaSchema).optional().default([]),
    
    // Partidas (obrigatório quando tipoDenuncia for PARTIDA_ESPECIFICA)
    partidas: z.array(PartidaSchema).optional().default([])
}).refine((data) => {
    // Se for PARTIDA_ESPECIFICA, deve ter pelo menos uma partida
    if (data.tipoDenuncia === "PARTIDA_ESPECIFICA") {
        return data.partidas.length > 0;
    }
    return true;
}, {
    message: "Para denúncias de partida específica, pelo menos uma partida deve ser informada",
    path: ["partidas"]
});

export type CreateReportSchemaType = typeof CreateReportSchema;
export type CreateReport = z.infer<typeof CreateReportSchema>;