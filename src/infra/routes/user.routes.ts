import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  requireAdmin,
  verifyJWT,
} from '../../shared/middlewares/auth';

export async function usersRoutes(app: FastifyInstance) {
  const createUserBodySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  // Cadastro de usuário (DEV: não persiste, só valida e retorna fake)
  app.post('/users', async (req, reply) => {
    const body = createUserBodySchema.parse(req.body);

    const now = new Date();
    return reply.status(201).send({
      id: `TEMP-${now.getTime()}`,
      name: body.name,
      email: body.email,
      role: 'ADMIN' as const,
      createdAt: now,
    });
  });

  // Login (DEV: gera JWT sem checar no banco)
  app.post('/sessions', async (req, reply) => {
    const body = authenticateBodySchema.parse(req.body);

    const sub = `dev-${Date.now()}`;

    const token = await reply.jwtSign({
      sub,
      email: body.email,
      role: 'ADMIN' as const
    });

    return reply.send({ token });
  });

  // Rota autenticada
  app.get('/me', { preHandler: [verifyJWT] }, async (req, reply) => {
    return reply.send({ user: req.user });
  });

  // Rota admin-only
  app.get(
    '/admin/health',
    { preHandler: [requireAdmin] },
    async (_req, reply) => {
      return reply.send({ ok: true });
    }
  );
}