import { FastifyInstance } from 'fastify';
import z from 'zod';
import { FastifyTypedInstance } from "../../../../shared/types/types";
import { FindManyPeopleQuerySchema } from '../../dtos/FindManyPeopleOptionsDTO';
import { PeopleListResponseSchema, PersonResponseSchema } from '../../dtos/PeopleResponseDTO';
import { UpdatePersonSchema } from '../../dtos/UpdatePersonDTO';
import { GetPeopleController } from '../../controllers/GetPeopleController';
import { GetPersonByIdController } from '../../controllers/GetPersonByIdController';
import { UpdatePersonController } from '../../controllers/UpdatePersonController';

export async function peopleRoutes(app: FastifyTypedInstance) {
  const baseTag = "Pessoas (Backoffice)";

  // GET /v1/pessoas (lista pessoas, protegido)
  app.get('/', {
    schema: {
      tags: [baseTag],
      summary: "Listar Pessoas com filtros (Backoffice)",
      description: "Lista, busca e filtra registros de pessoas. Protegido para backoffice.",
      querystring: FindManyPeopleQuerySchema,
      response: { 200: PeopleListResponseSchema }
    }
  }, (request, reply) => {
    new GetPeopleController().handle(request as any, reply as any);
  });

  // GET /v1/pessoas/:id (visualiza, protegido)
  app.get('/:id', {
    schema: {
      tags: [baseTag],
      summary: "Visualizar Pessoa por ID (Backoffice)",
      description: "Obtém dados detalhados de uma pessoa específica. Protegido.",
      params: z.object({ id: z.string().uuid() }),
      response: { 200: PersonResponseSchema }
    }
  }, (request, reply) => {
    new GetPersonByIdController().handle(request as any, reply as any);
  });

  // PATCH /v1/pessoas/:id (atualiza, protegido)
  app.patch('/:id', {
    schema: {
      tags: [baseTag],
      summary: "Atualizar Pessoa por ID (Backoffice)",
      description: "Atualiza informações (nome, função, observações, status) de uma pessoa. Protegido.",
      params: z.object({ id: z.string().uuid() }),
      body: UpdatePersonSchema,
      response: { 200: PersonResponseSchema }
    }
  }, (request, reply) => {
    new UpdatePersonController().handle(request as any, reply as any);
  });
}