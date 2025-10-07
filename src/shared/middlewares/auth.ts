import { FastifyReply, FastifyRequest } from 'fastify';

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    sub: string;
    email: string;
    role: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
  };
}

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
  requireRole(allowedRoles: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const userRole = (request as any).user?.role;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return reply.status(403).send({ 
          message: 'Acesso negado. Permissões insuficientes.' 
        });
      }
    };
  }
}

// Manter compatibilidade com código antigo
export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const authMiddleware = new AuthenticationMiddleware();
  return authMiddleware.handle(request, reply);
}

export const requireAdmin = verifyJWT;