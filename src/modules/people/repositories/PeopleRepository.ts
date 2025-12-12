import { CreatePersonDTO } from '../dtos/CreatePersonDTO';
import { UpdatePersonDTO } from '../dtos/UpdatePersonDTO';
import { FindManyPeopleQueryDTO } from '../dtos/FindManyPeopleOptionsDTO';
import { PersonResponseDTO, PersonSummaryResponseDTO } from '../dtos/PeopleResponseDTO';

interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface PeopleRepository {
    /**
     * Cria um novo registro de Pessoa (usado na criação de Denúncia).
     * Retorna a entidade criada mapeada para o DTO.
     */
    create(data: CreatePersonDTO & { denunciaId: string }): Promise<PersonResponseDTO>;

    /**
     * Busca uma Pessoa por ID.
     */
    findById(id: string): Promise<PersonResponseDTO | null>;

    /**
     * Lista Pessoas com paginação, busca e filtros.
     */
    findMany(options: FindManyPeopleQueryDTO): Promise<PaginatedResult<PersonSummaryResponseDTO>>;

    /**
     * Atualiza as informações de uma Pessoa.
     * Retorna a entidade atualizada mapeada para o DTO.
     */
    update(id: string, data: Partial<UpdatePersonDTO>): Promise<PersonResponseDTO>;

    /**
     * Verifica se uma pessoa existe pelo ID.
     */
    exists(id: string): Promise<boolean>;
}