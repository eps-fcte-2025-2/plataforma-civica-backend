import z from "zod";

// DTO para atualizar status da denúncia
export const UpdateReportStatusSchema = z.object({
    status: z.enum(["PENDENTE", "EM_ANALISE", "APROVADA", "REJEITADA", "ARQUIVADA"], {
        message: "Status deve ser um dos valores válidos: PENDENTE, EM_ANALISE, APROVADA, REJEITADA, ARQUIVADA"
    }),
    observacoes: z.string().max(1000, "Observações não podem exceder 1000 caracteres").optional()
});

export type UpdateReportStatusSchemaType = typeof UpdateReportStatusSchema;
export type UpdateReportStatus = z.infer<typeof UpdateReportStatusSchema>;