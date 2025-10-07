import { ReportsRepositoryImpl } from "../infra/repositories/ReportsRepositoryImpl";
import { CreateReportUseCase } from "../usecases/CreateReportUseCase";
import { GetReportByIdUseCase } from "../usecases/GetReportByIdUseCase";
import { GetReportsUseCase } from "../usecases/GetReportsUseCase";
import { UpdateReportStatusUseCase } from "../usecases/UpdateReportStatusUseCase";

export function buildCreateReportUseCase(): CreateReportUseCase {
    const reportsRepository = new ReportsRepositoryImpl();
    return new CreateReportUseCase(reportsRepository);
}

export function buildGetReportByIdUseCase(): GetReportByIdUseCase {
    const reportsRepository = new ReportsRepositoryImpl();
    return new GetReportByIdUseCase(reportsRepository);
}

export function buildGetReportsUseCase(): GetReportsUseCase {
    const reportsRepository = new ReportsRepositoryImpl();
    return new GetReportsUseCase(reportsRepository);
}

export function buildUpdateReportStatusUseCase(): UpdateReportStatusUseCase {
    const reportsRepository = new ReportsRepositoryImpl();
    return new UpdateReportStatusUseCase(reportsRepository);
}