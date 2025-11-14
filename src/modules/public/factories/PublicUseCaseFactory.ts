import { GetDashboardMetricsUseCase } from "../usecases/GetDashboardMetricsUseCase";
import { PublicRepositoryImpl } from "../infra/repositories/PublicRepositoryImpl";

export class PublicUseCaseFactory {
    static createGetDashboardMetricsUseCase(): GetDashboardMetricsUseCase {
        const publicRepository = new PublicRepositoryImpl();
        return new GetDashboardMetricsUseCase(publicRepository);
    }
}

// Export default também para compatibilidade
export default PublicUseCaseFactory;