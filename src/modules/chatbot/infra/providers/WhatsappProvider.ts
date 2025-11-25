export class WhatsappProvider {
  // Garante valores padrão ou pega do .env
  private apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0';
  private phoneId = process.env.WHATSAPP_PHONE_ID;
  private token = process.env.WHATSAPP_ACCESS_TOKEN;

  async sendMessage(to: string, content: string): Promise<void> {
    if (!this.phoneId || !this.token) {
      console.error('[WhatsappProvider] Credenciais ausentes no .env');
      return;
    }

    const url = `${this.apiUrl}/${this.phoneId}/messages`;

    try {
      // Usando FETCH nativo do Node 18+
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          text: { body: content },
        }),
      });

      // O fetch não lança erro em 4xx ou 5xx automaticamente, precisamos checar:
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[WhatsappProvider] Erro na API da Meta:', JSON.stringify(errorData, null, 2));
        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
      }

    } catch (error) {
      console.error('[WhatsappProvider] Falha na requisição:', error);
      // Opcional: Relançar o erro ou apenas logar, dependendo da sua estratégia de resiliência
    }
  }
}