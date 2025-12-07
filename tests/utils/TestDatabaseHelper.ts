import { exec } from 'child_process';
import { promisify } from 'util';

import { PrismaClient } from '../../generated/prisma';

const execAsync = promisify(exec);

export class TestDatabaseHelper {
  private static prisma: PrismaClient;

  /**
   * Inicializa o banco de dados de teste
   */
  static async setup() {
    try {
      // Aplica as migrations
      await execAsync('npx prisma migrate deploy');
      
      // Cria conexão com o Prisma
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
      
      console.log('✅ Banco de teste inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de teste:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os dados das tabelas (mantém estrutura)
   */
  static async cleanup() {
    if (!this.prisma) return;

    try {
      // Lista todas as tabelas e limpa os dados
      const tablenames = await this.prisma.$queryRaw<
        Array<{ tablename: string }>
      >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

      for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
          try {
            await this.prisma.$executeRawUnsafe(
              `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
            );
          } catch (error) {
            console.log(`Aviso: Não foi possível limpar tabela ${tablename}`);
          }
        }
      }
      
      console.log('✅ Dados do banco de teste limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar banco de teste:', error);
      throw error;
    }
  }

  /**
   * Finaliza a conexão com o banco de dados de teste
   */
  static async teardown() {
    if (!this.prisma) return;

    try {
      await this.prisma.$disconnect();
      console.log('✅ Banco de teste desconectado');
    } catch (error) {
      console.error('❌ Erro ao desconectar banco de teste:', error);
      throw error;
    }
  }

  /**
   * Retorna a instância do Prisma Client para testes
   */
  static getPrisma(): PrismaClient {
    if (!this.prisma) {
      throw new Error('Prisma não foi inicializado. Execute TestDatabaseHelper.setup() primeiro.');
    }
    return this.prisma;
  }

  /**
   * Reseta o banco (limpa + reconecta)
   */
  static async reset() {
    await this.cleanup();
  }
}
