import z from "zod";

export const PaginateQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).optional().default(200)
});

export type PaginateQuerySchemaType = typeof PaginateQuerySchema;

export type PaginateQuery = z.infer<typeof PaginateQuerySchema>;
