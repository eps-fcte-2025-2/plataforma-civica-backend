import { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    user?: {
      sub: string;
      email: string;
      role: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
    };
  }
}
export type UserRole = 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN' | 'BACKOFFICE';

type AuthenticatedRequest = FastifyRequest;

export class AuthenticationMiddleware {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ message: 'Token inválido ou ausente' });
    }
  }
}

export class AuthorizationMiddleware {
  requireRole(allowedRoles: UserRole[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const userRole = (request as any).user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return reply.status(403).send({
          message: 'Acesso negado. Permissões insuficientes.',
        });
      }
    };
  }
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const authMiddleware = new AuthenticationMiddleware();
  return authMiddleware.handle(request, reply);
}

export const requireAdmin = verifyJWT;

export function createAuthorizationMiddleware(allowedRoles: UserRole[]) {
  const authMiddleware = new AuthenticationMiddleware();
  const authzMiddleware = new AuthorizationMiddleware();
  
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Primeiro valida autenticação (401)
    await authMiddleware.handle(request, reply);
    
    // Se passou na autenticação, valida autorização (403)
    if (reply.statusCode === 200 || !reply.sent) {
      await authzMiddleware.requireRole(allowedRoles)(request, reply);
    }
  };
}
