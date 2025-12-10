import { exec } from 'node:child_process';
import { promisify } from 'node:util';

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
      // Limpa os dados de todas as tabelas conhecidas do Prisma de forma dinâmica.
      // Isso evita ter que manter uma lista manual de modelos e previne
      // inconsistências quando novos modelos são adicionados.
      // Nota: _dmmf é uma API interna do Prisma, mas é amplamente usada em testes
      // para descobrir dinamicamente os modelos disponíveis.
      // Usamos deleteMany() para cada model para manter a estrutura do schema.

      // @ts-ignore - acessando propriedade interna do Prisma Client
      const modelMap = (this.prisma as any)._dmmf?.modelMap;
      if (!modelMap) {
        console.warn('Aviso: não foi possível localizar modelMap no Prisma Client; limpeza manual poderá ser necessária.');
        return;
      }

      const models = Object.keys(modelMap);

      for (const model of models) {
        try {
          // @ts-ignore - index access dinâmico
          await (this.prisma as any)[model].deleteMany();
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.warn(`Aviso: Não foi possível limpar modelo ${model}: ${error.message}`);
          } else {
            console.warn(`Aviso: Não foi possível limpar modelo ${model}:`, error);
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
