import { z } from 'zod';

export const UpdatePersonSchema = z.object({
  nomePessoa: z.string().min(1, 'O nome da pessoa é obrigatório.').max(255).optional(),
  funcaoPessoa: z.string().min(1, 'A função da pessoa é obrigatória.').max(255).optional(),
  observacoes: z.string().max(1000).nullish(),
  status: z.enum(['ativo', 'inativo', 'pendente']).optional(), 
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Pelo menos um campo deve ser fornecido para atualização.' }
);

export type UpdatePersonDTO = z.infer<typeof UpdatePersonSchema>;
export type UpdatePersonSchemaType = typeof UpdatePersonSchema;