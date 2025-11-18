import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginUseCase } from '../usecases/LoginUseCase';
import { LoginInputDto } from '../dtos/LoginInputDto';

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(request: FastifyRequest<{ Body: LoginInputDto }>, reply: FastifyReply) {
    try {
      const result = await this.loginUseCase.execute(request.body);

      return reply.status(200).send(result);
    } catch (error) {
      throw error;
    }
  }
}
