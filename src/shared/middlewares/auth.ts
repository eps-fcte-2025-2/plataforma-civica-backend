import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJWT(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: 'Invalid or missing token' });
  }
}

export const requireAdmin = verifyJWT;