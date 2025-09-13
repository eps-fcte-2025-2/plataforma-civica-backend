import { ExampleRepositoryImpl } from "../infra/repositories/ExampleRepositoryImpl";
import { ExampleUseCase } from "../usecases/ExampleUseCase";

export function buildExampleUseCase() {
    return new ExampleUseCase(ExampleRepositoryImpl.getInstance());
}