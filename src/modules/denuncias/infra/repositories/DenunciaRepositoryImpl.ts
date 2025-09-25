import { PrismaClient } from "../../../../../generated/prisma";
import { DatabaseConnection } from "../../../../infra/database/DatabaseConnection";
import { DenunciaRepository } from "../../repositories/DenunciaRepository";
import { PaginatedResult } from "../../dtos/PaginationDTO";


export class DenunciaRepositoryImpl implements DenunciaRepository {
    private prismaClient: PrismaClient;
    private constructor() {
        this.prismaClient = DatabaseConnection.getConnection();
    }

    private static INSTANCE: DenunciaRepositoryImpl;
    public static getInstance() {
        if (!DenunciaRepositoryImpl.INSTANCE) {
            DenunciaRepositoryImpl.INSTANCE = new DenunciaRepositoryImpl();
        }

        return DenunciaRepositoryImpl.INSTANCE;
    }
 
    async findAll(params?: any): Promise<any[]> {
        return this.prismaClient.denuncia.findMany({
            where: params
        });
    }

    async findPaginated(params: any, page: number, pageSize: number): Promise<PaginatedResult<any>> {
        const skip = (page - 1) * pageSize;
        const [data, totalCount] = await Promise.all([
            this.prismaClient.denuncia.findMany({
                where: params,
                skip,
                take: pageSize
            }),
            this.prismaClient.denuncia.count({ where: params })
        ]);
        return {
            data,
            totalCount,
            page,
            pageSize
        };
    }
}