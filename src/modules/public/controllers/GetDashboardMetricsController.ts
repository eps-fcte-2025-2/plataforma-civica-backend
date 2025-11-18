import { FastifyRequest, FastifyReply } from 'fastify';
import { GetDashboardMetricsUseCase } from '../usecases/GetDashboardMetricsUseCase';
import { PublicRepositoryImpl } from '../infra/repositories/PublicRepositoryImpl';

export class GetDashboardMetricsController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Criar dependências diretamente aqui para evitar problemas de import
    const publicRepository = new PublicRepositoryImpl();
    const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(publicRepository);

    const metrics = await getDashboardMetricsUseCase.execute();

    reply.code(200).send(metrics);
  }
}
