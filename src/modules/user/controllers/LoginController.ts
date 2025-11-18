import { FastifyReply,FastifyRequest } from 'fastify';

import { LoginInputDto } from '../dtos/LoginInputDto';
import { LoginUseCase } from '../usecases/LoginUseCase';

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
