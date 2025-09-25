import { FastifyTypedInstance } from "../../../../shared/types/types";
import { ControllerReports } from "../../controllers/ControllerReports";
import { ResponseDTOExampleSchema } from '../../../reports/dtos/ResponseDTOReport';
import { ReportQuerySchema } from '../../dtos/ReportFilterSchema';

export async function denunciasRoutes(app: FastifyTypedInstance) {
    app.get("/reports", {
        schema: {
            tags: ["reports"],
            description: "Routes of reports - Suporta filtros por data, esporte, status e score",
            params: null,
            response: {
                200: ResponseDTOExampleSchema
            },
            querystring: ReportQuerySchema,
        }
    }, new ControllerReports().getReports);
}