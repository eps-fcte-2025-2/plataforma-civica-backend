import { PrismaClient } from '../../../../../generated/prisma';
import { DatabaseConnection } from '../../../../infra/database/DatabaseConnection';
import { ExampleRepository } from '../../repositories/ExampleRepository';

export class ExampleRepositoryImpl implements ExampleRepository {
  private prismaClient: PrismaClient;
  private constructor() {
    this.prismaClient = DatabaseConnection.getConnection();
  }

  private static INSTANCE: ExampleRepositoryImpl;
  public static getInstance() {
    if (!ExampleRepositoryImpl.INSTANCE) {
      ExampleRepositoryImpl.INSTANCE = new ExampleRepositoryImpl();
    }

    return ExampleRepositoryImpl.INSTANCE;
  }

  async listAllExamples(): Promise<{ informacoes: string }> {
    return {
      informacoes: 'Informações de exemplo',
    };
    // return this.prismaClient.user.findMany();
    // Exemplo de uso do prisma
  }
}
