import {
  AuthenticationMiddleware,
  AuthorizationMiddleware,
} from '../../../../shared/middlewares/auth';
import { FastifyTypedInstance } from '../../../../shared/types/types';
import { CreateUserInputDtoSchema } from '../../dtos/CreateUserInputDto';
import { LoginInputDtoSchema } from '../../dtos/LoginInputDto';
import { LoginOutputDtoSchema } from '../../dtos/LoginOutputDto';
import { UserOutputDtoSchema } from '../../dtos/UserOutputDto';
import { UserFactory } from '../../factories/UserFactory';
import z from 'zod';

export async function userRoutes(app: FastifyTypedInstance) {
  const userFactory = new UserFactory();

  // Middleware de autenticação
  const authMiddleware = new AuthenticationMiddleware();
  const authzMiddleware = new AuthorizationMiddleware();

  // POST /auth/register - Criar usuário
  app.post(
    '/auth/register',
    {
      schema: {
        tags: ['Usuários'],
        summary: 'Criar novo usuário',
        description: 'Registra um novo usuário no sistema',
        body: CreateUserInputDtoSchema,
        response: {
          201: UserOutputDtoSchema,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const controller = userFactory.createUserController();
      return controller.handle(request as any, reply);
    }
  );

  // POST /auth/login - Login
  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['Usuários'],
        summary: 'Fazer login',
        description: 'Autentica usuário e retorna token JWT',
        body: LoginInputDtoSchema,
        response: {
          200: LoginOutputDtoSchema,
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const controller = userFactory.loginController(reply.jwtSign.bind(reply));
      return controller.handle(request as any, reply);
    }
  );

  // GET /auth/me - Perfil do usuário autenticado
  app.get(
    '/auth/me',
    {
      preHandler: [authMiddleware.handle.bind(authMiddleware)],
      schema: {
        tags: ['Usuários'],
        summary: 'Obter perfil do usuário autenticado',
        description: 'Retorna os dados do usuário logado',
        security: [{ bearerAuth: [] }],
        response: {
          200: UserOutputDtoSchema,
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const controller = userFactory.getUserProfileController();
      return controller.handle(request as any, reply);
    }
  );

  // GET /auth/admin/health - Rota apenas para admins
  app.get(
    '/auth/admin/health',
    {
      preHandler: [
        authMiddleware.handle.bind(authMiddleware),
        authzMiddleware.requireRole(['ADMIN', 'SUPER_ADMIN']).bind(authzMiddleware),
      ],
      schema: {
        tags: ['Admin'],
        summary: 'Health check para administradores',
        description: 'Verifica se o usuário tem permissões de administrador',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            status: z.string(),
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          403: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.send({ status: 'ok', message: 'Admin access granted' });
    }
  );
}
