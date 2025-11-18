import { z } from 'zod';

export const LoginOutputDtoSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['ADMIN', 'MODERATOR', 'SUPER_ADMIN']),
  }),
});

export type LoginOutputDto = z.infer<typeof LoginOutputDtoSchema>;
