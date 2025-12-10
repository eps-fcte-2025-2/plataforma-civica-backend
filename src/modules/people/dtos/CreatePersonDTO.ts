import { z } from 'zod';

export const CreatePersonSchema = z.object({
  nomePessoa: z.string().min(1, 'O nome da pessoa é obrigatório.').max(255),
  funcaoPessoa: z.string().min(1, 'A função da pessoa é obrigatória.').max(255),
  observacoes: z.string().max(1000).nullish(),
});

export type CreatePersonDTO = z.infer<typeof CreatePersonSchema>;
export type CreatePersonSchemaType = typeof CreatePersonSchema;