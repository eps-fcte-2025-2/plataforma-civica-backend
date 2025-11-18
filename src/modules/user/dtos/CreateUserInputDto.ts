import { z } from 'zod';

export const CreateUserInputDtoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email deve ser válido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  role: z.enum(['ADMIN', 'MODERATOR', 'SUPER_ADMIN']).default('ADMIN'),
});

export type CreateUserInputDto = z.infer<typeof CreateUserInputDtoSchema>;
