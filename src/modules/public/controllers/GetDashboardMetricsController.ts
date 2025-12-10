import { FastifyReply,FastifyRequest } from 'fastify';

import { PublicRepositoryImpl } from '../infra/repositories/PublicRepositoryImpl';
import { GetDashboardMetricsUseCase } from '../usecases/GetDashboardMetricsUseCase';

export class GetDashboardMetricsController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Criar dependências diretamente aqui para evitar problemas de import
    const publicRepository = new PublicRepositoryImpl();
    const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(publicRepository);

    const metrics = await getDashboardMetricsUseCase.execute();

    reply.code(200).send(metrics);
  }
}
