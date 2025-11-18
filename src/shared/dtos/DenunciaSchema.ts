import z from 'zod';

// Enums
export const TipoDenunciaEnum = z.enum(['PARTIDA_ESPECIFICA', 'ESQUEMA_DE_MANIPULACAO']);
export const ComoSoubeEnum = z.enum([
  'VITIMA',
  'TERCEIROS',
  'INTERNET',
  'PRESENCIAL',
  'OBSERVACAO',
  'OUTROS',
]);
export const PontualOuDisseminadoEnum = z.enum(['PONTUAL', 'DISSEMINADO']);
export const FrequenciaEnum = z.enum(['ISOLADO', 'FREQUENTE']);
export const FocoManipulacaoEnum = z.enum(['ATLETAS_DIRIGENTES_COMISSAO', 'APOSTADORES', 'JUIZES']);
export const TipoEvidenciaEnum = z.enum(['DOCUMENTO', 'IMAGEM', 'VIDEO', 'AUDIO', 'OUTRO']);

// Subschemas
export const MunicipioSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  uf: z.string(),
});

export const PartidaSchema = z.object({
  id: z.string().uuid(),
  torneio: z.string(),
  dataPartida: z.coerce.date(),
  localPartida: z.string(),
  timeA: z.string().nullable().optional(),
  timeB: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
});

export const PessoaSchema = z.object({
  id: z.string().uuid(),
  nomePessoa: z.string(),
  funcaoPessoa: z.string(),
});

export const ClubeSchema = z.object({
  id: z.string().uuid(),
  nomeClube: z.string(),
});

export const DenunciaFocoSchema = z.object({
  id: z.string().uuid(),
  foco: FocoManipulacaoEnum,
});

export const EvidenciaSchema = z.object({
  id: z.string().uuid(),
  nomeOriginal: z.string(),
  nomeArquivo: z.string(),
  caminhoArquivo: z.string(),
  tamanhoBytes: z.number(),
  mimeType: z.string(),
  tipo: TipoEvidenciaEnum,
  descricao: z.string().optional(),
  dataUpload: z.coerce.date(),
});

// DTO principal
export const DenunciaSchema = z.object({
  id: z.string().uuid(),
  tipoDenuncia: TipoDenunciaEnum,
  descricao: z.string(),
  comoSoube: ComoSoubeEnum.optional(),
  pontualOuDisseminado: PontualOuDisseminadoEnum,
  frequencia: FrequenciaEnum,
  dataDenuncia: z.coerce.date(),

  municipio: MunicipioSchema,
  partidas: z.array(PartidaSchema),
  clubesEnvolvidos: z.array(ClubeSchema),
  pessoasEnvolvidas: z.array(PessoaSchema),
  focosManipulacao: z.array(DenunciaFocoSchema),
  evidencias: z.array(EvidenciaSchema),
});

export type DenunciaDTO = z.infer<typeof DenunciaSchema>;
