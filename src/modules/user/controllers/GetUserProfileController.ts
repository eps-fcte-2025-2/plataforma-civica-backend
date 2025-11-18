import { FastifyRequest, FastifyReply } from 'fastify';
import { GetUserProfileUseCase } from '../usecases/GetUserProfileUseCase';

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    sub: string;
    email: string;
    role: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
  };
}

export class GetUserProfileController {
  constructor(private getUserProfileUseCase: GetUserProfileUseCase) {}

  async handle(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub;
      const user = await this.getUserProfileUseCase.execute(userId);

      return reply.status(200).send(user);
    } catch (error) {
      throw error;
    }
  }
}
