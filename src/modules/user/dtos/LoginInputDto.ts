import { z } from 'zod';

export const LoginInputDtoSchema = z.object({
  email: z.string().email('Email deve ser válido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export type LoginInputDto = z.infer<typeof LoginInputDtoSchema>;
