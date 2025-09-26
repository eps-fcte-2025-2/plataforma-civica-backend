import { z } from 'zod';

export const UserOutputDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'MODERATOR', 'SUPER_ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UserOutputDto = z.infer<typeof UserOutputDtoSchema>;
