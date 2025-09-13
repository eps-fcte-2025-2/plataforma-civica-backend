export interface ExampleRepository {
    listAllExamples(): Promise<{ informacoes: string }>;
}