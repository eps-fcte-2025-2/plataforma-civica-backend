import { z } from 'zod';
import { Frequencia, PontualOuDisseminado, TipoDenuncia } from '../../../../generated/prisma';

// Schema de validação usando Zod
export const GetReportsQuerySchemaDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  uf: z.string().length(2).optional(),
  municipio: z.string().optional(),
  tipoDenuncia: z.nativeEnum(TipoDenuncia).optional(),
  frequencia: z.nativeEnum(Frequencia).optional(),
  pontualOuDisseminado: z.nativeEnum(PontualOuDisseminado).optional(),
  dataInicio: z.string().datetime().optional(), // 'YYYY-MM-DDTHH:mm:ss.sssZ'
  dataFim: z.string().datetime().optional(),
  termoBusca: z.string().optional(),
});

// Extrai o tipo TypeScript do schema Zod
export type GetReportsQuerySchemaType = z.infer<typeof GetReportsQuerySchemaDTO>;
