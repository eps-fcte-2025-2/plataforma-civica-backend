import { z } from 'zod';

// DTO para os Query Parameters (Busca e Filtros)
export const FindManyPeopleQuerySchema = z.object({
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('10'),  
  nomePessoa: z.string().optional(),
  funcaoPessoa: z.string().optional(),
  associadaADenuncia: z.enum(['true', 'false']).optional(),
});

export type FindManyPeopleQueryDTO = z.infer<typeof FindManyPeopleQuerySchema>;
export type FindManyPeopleQuerySchemaType = typeof FindManyPeopleQuerySchema;