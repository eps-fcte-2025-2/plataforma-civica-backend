import { Frequencia, PontualOuDisseminado, TipoDenuncia } from "../../../../../generated/prisma"; // Importe os enums

export interface FindManyReportsOptionsDTO {
    page: number;
    pageSize: number;
    filters: {
        tipoDenuncia?: TipoDenuncia;
        frequencia?: Frequencia;
        pontualOuDisseminado?: PontualOuDisseminado;
        uf?: string;
        municipio?: string;
        dataInicio?: string; // Formato YYYY-MM-DD
        dataFim?: string;    // Formato YYYY-MM-DD
        termoBusca?: string; // Para buscar na descrição, nome de pessoas, etc.
    };
}
