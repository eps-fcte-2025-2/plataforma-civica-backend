import { z } from 'zod';

// Schema de resposta das métricas do dashboard público
export const DashboardMetricsResponseSchema = z.object({
  totalDenuncias: z.number().int().nonnegative(),
  denunciasPorStatus: z.object({
    pendentes: z.number().int().nonnegative(),
    emAnalise: z.number().int().nonnegative(),
    aprovadas: z.number().int().nonnegative(),
    rejeitadas: z.number().int().nonnegative(),
    arquivadas: z.number().int().nonnegative(),
  }),
  denunciasPorTipo: z.object({
    partidaEspecifica: z.number().int().nonnegative(),
    esquemaManipulacao: z.number().int().nonnegative(),
  }),
  denunciasPorRegiao: z.array(
    z.object({
      uf: z.string(),
      total: z.number().int().nonnegative(),
    })
  ),
  dadosParaMapa: z.array(
    z.object({
      municipio: z.string(),
      uf: z.string(),
      total: z.number().int().nonnegative(),
      // Coordenadas serão adicionadas pelo frontend usando API externa
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
  ),
  evolucaoTemporal: z.array(
    z.object({
      periodo: z.string(), // YYYY-MM format
      total: z.number().int().nonnegative(),
    })
  ),
});

export type DashboardMetricsResponse = z.infer<typeof DashboardMetricsResponseSchema>;
