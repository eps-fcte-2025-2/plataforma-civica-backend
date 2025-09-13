import z from "zod";

export const ResponseDTOExampleSchema = z.object({
    informacoes: z.string().min(1).max(255)
});


export type ResponseDTOExampleSchemaType = typeof ResponseDTOExampleSchema;

export type ResponseDTOExample = z.infer<typeof ResponseDTOExampleSchema>;
