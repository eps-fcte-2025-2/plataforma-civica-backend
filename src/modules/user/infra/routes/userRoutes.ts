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
        description: 'Criar novo usuário',
        body: CreateUserInputDtoSchema,
        response: {
          201: UserOutputDtoSchema,
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
        description: 'Fazer login',
        body: LoginInputDtoSchema,
        response: {
          200: LoginOutputDtoSchema,
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
        description: 'Obter perfil do usuário autenticado',
        response: {
          200: UserOutputDtoSchema,
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
        description: 'Health check para administradores',
      },
    },
    async (request, reply) => {
      return reply.send({ status: 'ok', message: 'Admin access granted' });
    }
  );
}
