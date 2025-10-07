import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserUseCase } from '../usecases/CreateUserUseCase';
import { CreateUserInputDto } from '../dtos/CreateUserInputDto';

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
