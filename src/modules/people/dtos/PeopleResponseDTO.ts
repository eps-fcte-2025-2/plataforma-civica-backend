import { z } from 'zod';

// DTO de resposta para uma Pessoa (GET /:id)
export const PersonResponseSchema = z.object({
    id: z.string().uuid(),
    nomePessoa: z.string(),
    funcaoPessoa: z.string(),
    observacoes: z.string().nullable(),
    status: z.string(),
    dataRegistro: z.string().datetime(),
    denunciaId: z.string().uuid().nullable(),
});

// DTO para o item da lista (GET /)
export const PersonSummaryResponseSchema = z.object({
    id: z.string().uuid(),
    nomePessoa: z.string(),
    funcaoPessoa: z.string(),
    status: z.string(),
    dataRegistro: z.string().datetime(),
    associadaADenuncia: z.boolean(),
});

// DTO para a resposta completa da lista
export const PeopleListResponseSchema = z.object({
    data: z.array(PersonSummaryResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});

export type PersonResponseDTO = z.infer<typeof PersonResponseSchema>;
export type PersonSummaryResponseDTO = z.infer<typeof PersonSummaryResponseSchema>;
export type PeopleListResponseDTO = z.infer<typeof PeopleListResponseSchema>;
export type PersonResponseSchemaType = typeof PersonResponseSchema;
export type PeopleListResponseSchemaType = typeof PeopleListResponseSchema;