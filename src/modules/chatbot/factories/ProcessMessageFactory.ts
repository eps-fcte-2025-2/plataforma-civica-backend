import { WhatsappProvider } from '../infra/providers/WhatsappProvider';
import { ProcessMessageUseCase } from '../usecases/ProcessMessageUseCase';

export function makeProcessMessageUseCase(): ProcessMessageUseCase {
  const whatsappProvider = new WhatsappProvider();
  const processMessageUseCase = new ProcessMessageUseCase(whatsappProvider);
  return processMessageUseCase;
}