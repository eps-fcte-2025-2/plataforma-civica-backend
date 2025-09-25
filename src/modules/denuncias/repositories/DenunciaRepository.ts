export interface DenunciaRepository {
    findAll(params?: any): Promise<any[]>;

    /**
     * @param params Filtros opcionais
     * @param page Página atual (1-indexed)
     * @param pageSize Quantidade por página
     * @returns Um objeto com dados, totalCount, page e pageSize
     */
    findPaginated(params: any, page: number, pageSize: number): Promise<{
        data: any[];
        totalCount: number;
        page: number;
        pageSize: number;
    }>;
}