import z from 'zod';

export const RequestDTOExampleSchema = z.object({
  nome: z.string().min(1).max(15),
});

export type RequestDTOExampleSchemaType = typeof RequestDTOExampleSchema;

export type RequestDTOExample = z.infer<typeof RequestDTOExampleSchema>;
