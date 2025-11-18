import { DatabaseConnection } from '../../../infra/database/DatabaseConnection';
import { Controller, TypedRequest, TypedResponse } from '../../../shared/patterns/Controller';
import z from 'zod';

// DEPRECATED: Controller removido após mudança para campos de string
// Agora os municípios são gerenciados via API externa (ex: IBGE)
/*
const MunicipioSchema = z.object({
    id: z.string().uuid(),
    nome: z.string(),
    uf: z.string()
});

const MunicipiosResponseSchema = z.array(MunicipioSchema);

export class GetMunicipiosController implements Controller<
    any,
    any,
    any,
    { 200: typeof MunicipiosResponseSchema }
> {
    async handle(
        request: TypedRequest<any, any, any>,
        response: TypedResponse<{ 200: typeof MunicipiosResponseSchema }>
    ): Promise<void> {
        const prisma = DatabaseConnection.getConnection();
        
        const municipios = await prisma.municipio.findMany({
            orderBy: {
                nome: "asc"
            }
        });

        response.status(200).send(municipios);
    }
}
*/
