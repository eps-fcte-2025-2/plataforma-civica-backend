import { ResponseDTOExample } from "../dtos/ResponseDTOReport";
import { Command } from "../../../shared/patterns/Command"
import { ExampleRepository } from "../repositories/ExampleRepository";

interface ExampleInput {
    nome: string;
    page: number;
    pageSize: number;
}

export class ExampleUseCase implements Command<ExampleInput, Promise<ResponseDTOExample>> {
    private exampleRepository: ExampleRepository;
    constructor(exampleRepository: ExampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    async execute({ nome, page, pageSize }: ExampleInput): Promise<ResponseDTOExample> {
        return this.exampleRepository.listAllExamples();
    }

}