import { FastifyReply, FastifyRequest } from 'fastify';

export type UserRole = 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN' | 'BACKOFFICE';

export class AuthenticationMiddleware {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const decoded = await request.jwtVerify();
      (request as any).user = decoded; // garante que user.role exista
    } catch (err) {
      return reply.status(401).send({ message: 'Token inválido ou ausente' });
    }
  }
}

export class AuthorizationMiddleware {
  requireRole(allowedRoles: UserRole[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const userRole = user?.role;

      if (!userRole) {
        return reply.status(401).send({
          message: 'Token inválido ou ausente.',
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return reply.status(403).send({
          message: 'Acesso negado. Permissões insuficientes.',
        });
      }
    };
  }
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const auth = new AuthenticationMiddleware();
  return auth.handle(request, reply);
}

export function createAuthorizationMiddleware(roles: UserRole[]) {
  const auth = new AuthenticationMiddleware();
  const access = new AuthorizationMiddleware();

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await auth.handle(request, reply);
    if (reply.sent) return result;
    return access.requireRole(roles)(request, reply);
  };
}
