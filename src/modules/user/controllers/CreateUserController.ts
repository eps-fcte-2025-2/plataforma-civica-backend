import { FastifyReply,FastifyRequest } from 'fastify';

import { CreateUserInputDto } from '../dtos/CreateUserInputDto';
import { CreateUserUseCase } from '../usecases/CreateUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: FastifyRequest<{ Body: CreateUserInputDto }>, reply: FastifyReply) {
    try {
      const user = await this.createUserUseCase.execute(request.body);

      return reply.status(201).send(user);
    } catch (error) {
      throw error;
    }
  }
}
