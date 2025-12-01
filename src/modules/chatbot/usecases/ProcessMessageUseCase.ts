import { WhatsappProvider } from '../infra/providers/WhatsappProvider';

export class ProcessMessageUseCase {
  constructor(private whatsappProvider: WhatsappProvider) {}

  async execute(from: string, messageBody: string): Promise<void> {
    console.log(`🧠 Processando mensagem de ${from}: "${messageBody}"`);

    // 1. Simulação LangFlow (ainda nao implementado o real)
    const aiResponse = await this.mockLangFlow(messageBody);

    // 2. Enviar resposta via Provider
    await this.whatsappProvider.sendMessage(from, aiResponse);
  }

  private async mockLangFlow(input: string): Promise<string> {
    // Aqui entraria a chamada real ao LangFlow
    return `[IA Cívica]: Recebi sua mensagem "${input}". Estamos analisando sua denúncia.`;
  }
}