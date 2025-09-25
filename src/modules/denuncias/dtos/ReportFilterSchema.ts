import { PaginateQuerySchema } from "../../../shared/dtos/PaginationSchema";
import z from "zod";

export const ReportFilterSchema = z.object({
    data: z.coerce.date().optional(),
    esporte: z.string().optional(),
    status: z.enum(["ativo", "inativo", "pendente"]).optional(),
    score: z.coerce.number().optional()
});

export const ReportQuerySchema = PaginateQuerySchema.merge(ReportFilterSchema);

export type ReportQuerySchemaType = typeof ReportQuerySchema;
export type ReportQuery = z.infer<typeof ReportQuerySchema>;
export type ReportFilterSchemaType = typeof ReportFilterSchema;
export type ReportFilter = z.infer<typeof ReportFilterSchema>;