import { ExampleRepository } from "../../repositories/ExampleRepository";

export class ExampleRepositoryImpl implements ExampleRepository {
    private constructor() { }
    private static INSTANCE: ExampleRepositoryImpl;
    public static getInstance() {
        if (!ExampleRepositoryImpl.INSTANCE) {
            ExampleRepositoryImpl.INSTANCE = new ExampleRepositoryImpl();
        }

        return ExampleRepositoryImpl.INSTANCE;
    }

    async listAllExamples(): Promise<{ informacoes: string; }> {
        return {
            informacoes: "Informações de exemplo"
        }
    }
}