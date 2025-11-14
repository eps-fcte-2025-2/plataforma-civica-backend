import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      role: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
    };
    user: {
      sub: string;
      email: string;
      role: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
    };
  }
}