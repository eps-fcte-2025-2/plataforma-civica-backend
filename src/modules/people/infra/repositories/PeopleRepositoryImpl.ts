import { Prisma, PrismaClient } from "../../../../../generated/prisma"; 
import { DatabaseConnection } from '../../../../infra/database/DatabaseConnection';
import { PeopleRepository } from '../../repositories/PeopleRepository';
import { CreatePersonDTO } from '../../dtos/CreatePersonDTO';
import { UpdatePersonDTO } from '../../dtos/UpdatePersonDTO';
import { FindManyPeopleQueryDTO } from '../../dtos/FindManyPeopleOptionsDTO';
import { PersonResponseDTO, PersonSummaryResponseDTO } from '../../dtos/PeopleResponseDTO';


export class PeopleRepositoryImpl implements PeopleRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getConnection();
  }
  
  private mapPessoaToResponseDTO(pessoa: any): PersonResponseDTO {
    return {
        id: pessoa.id,
        nomePessoa: pessoa.nomePessoa,
        funcaoPessoa: pessoa.funcaoPessoa,
        observacoes: pessoa.observacoes,
        status: pessoa.status,
        dataRegistro: pessoa.dataRegistro.toISOString(),
        denunciaId: pessoa.denunciaId,
    };
  }


  async create(data: CreatePersonDTO & { denunciaId: string }): Promise<PersonResponseDTO> {
    const { denunciaId, ...rest } = data;
    const pessoa = await this.prisma.pessoa.create({
      data: {
        ...rest,
        observacoes: rest.observacoes ?? null,
        denunciaId,
      },
    });

    return this.mapPessoaToResponseDTO(pessoa);
  }

  async findById(id: string): Promise<PersonResponseDTO | null> {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoa) return null;

    return this.mapPessoaToResponseDTO(pessoa);
  }

  async update(id: string, data: Partial<UpdatePersonDTO>): Promise<PersonResponseDTO> {
    try {
        const pessoaAtualizada = await this.prisma.pessoa.update({
            where: { id },
            data,
        });
        return this.mapPessoaToResponseDTO(pessoaAtualizada);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error("Pessoa não encontrada."); 
        }
        throw error;
    }
  }

  async findMany({
    nomePessoa,
    funcaoPessoa,
    associadaADenuncia,
    page,
    limit,
  }: FindManyPeopleQueryDTO): Promise<{ data: PersonSummaryResponseDTO[]; total: number; page: number; limit: number; }> {
    const skip = (page - 1) * limit;

    const where: Prisma.PessoaWhereInput = {}; 

    if (nomePessoa) {
      where.nomePessoa = { contains: nomePessoa, mode: 'insensitive' };
    }

    if (funcaoPessoa) {
      where.funcaoPessoa = { equals: funcaoPessoa, mode: 'insensitive' };
    }

    if (associadaADenuncia) {
      if (associadaADenuncia === 'true') {
        where.denunciaId = { not: null };
      } else {
        where.denunciaId = null;
      }
    }

    const [pessoas, total] = await Promise.all([
      this.prisma.pessoa.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          dataRegistro: 'desc',
        },
      }),
      this.prisma.pessoa.count({ where }),
    ]);

    const data: PersonSummaryResponseDTO[] = pessoas.map(pessoa => ({
        id: pessoa.id,
        nomePessoa: pessoa.nomePessoa,
        funcaoPessoa: pessoa.funcaoPessoa,
        status: pessoa.status,
        dataRegistro: pessoa.dataRegistro.toISOString(),
        associadaADenuncia: !!pessoa.denunciaId, 
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }
  
  async exists(id: string): Promise<boolean> {
    const pessoa = await this.prisma.pessoa.findUnique({
        where: { id },
        select: { id: true },
    });
    return !!pessoa;
  }
}