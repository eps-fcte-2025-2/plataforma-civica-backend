import { z } from 'zod';

// Schema para Validação do GET (Verificação do Token)
export const VerifyWebhookQuerySchema = z.object({
  'hub.mode': z.string(),
  'hub.verify_token': z.string(),
  'hub.challenge': z.string(),
});

// Schema para Validação do POST (Mensagem Recebida)
export const WebhookMessageBodySchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z.array(
              z.object({
                from: z.string(),
                text: z.object({ body: z.string() }).optional(),
                type: z.string(),
                id: z.string(),
              })
            ).optional(),
            metadata: z.object({
              display_phone_number: z.string(),
              phone_number_id: z.string(),
            }),
          }),
        })
      ),
    })
  ),
});

export type VerifyWebhookQueryDTO = z.infer<typeof VerifyWebhookQuerySchema>;
export type WebhookMessageBodyDTO = z.infer<typeof WebhookMessageBodySchema>;