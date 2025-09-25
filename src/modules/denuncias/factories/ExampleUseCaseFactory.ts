import { ReportsRepository } from "../infra/repositories/reportsRepository";
import { ExampleUseCase } from "../../reports/usecases/ExampleUseCase";

export function buildExampleUseCase() {
    return new ExampleUseCase(ReportsRepository.getInstance());
}