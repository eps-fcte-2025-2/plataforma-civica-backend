import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { CreateReport } from "../dtos/CreateReportDTO";
import { CreateReportResponse } from "../dtos/ReportResponseDTO";
import { ReportsRepository } from "../repositories/ReportsRepository";

export class CreateReportUseCase {
    constructor(private reportsRepository: ReportsRepository) {}

    async execute(data: CreateReport): Promise<CreateReportResponse> {
        // Validações específicas por tipo de denúncia
        if (data.tipoDenuncia === "PARTIDA_ESPECIFICA") {
            if (!data.partidas || data.partidas.length === 0) {
                throw new BadRequestError("Para denúncias de partida específica, pelo menos uma partida deve ser informada");
            }
        }

        // Criar a denúncia
        const denunciaId = await this.reportsRepository.create(data);

        return {
            id: denunciaId,
            message: "Denúncia criada com sucesso",
            createdAt: new Date().toISOString()
        };
    }
}