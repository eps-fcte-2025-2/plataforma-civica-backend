import { PaginateQuerySchema } from "../../../../shared/dtos/PaginationSchema";
import { FastifyTypedInstance } from "../../../../shared/types/types";
import { ControllerExample } from "../../controllers/ControllerExample";
import { RequestDTOExampleSchema } from '../../dtos/RequestDTOExample';
import { ResponseDTOExampleSchema } from '../../dtos/ResponseDTOExample';

export async function exampleRoutes(app: FastifyTypedInstance) {
    // Middleware de exemplo
    // app.addHook("preHandler", MiddleWareDeExemplo);

    app.post("/", {
        schema: {
            tags: ["Exemplo"],
            description: "Rotas de exemplo",
            body: RequestDTOExampleSchema,
            params: null,
            response: {
                200: ResponseDTOExampleSchema
            },
            querystring: PaginateQuerySchema,
        }
    }, new ControllerExample().handle);
}