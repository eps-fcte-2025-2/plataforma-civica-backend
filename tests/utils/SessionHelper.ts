import { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';

import type { LoginOutputDto } from '../../src/modules/user/dtos/LoginOutputDto';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN' | 'BACKOFFICE';
}

export class SessionHelper {
  /**
   * Cria um usuário de teste via API
   */
  static async createUser(
    app: FastifyInstance,
    userData: Partial<TestUser> = {}
  ): Promise<{ email: string; password: string }> {
    const user = {
      email: userData.email || faker.internet.email(),
      password: userData.password || faker.internet.password(),
      name: userData.name || faker.person.fullName(),
      role: userData.role || 'ADMIN',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: user,
    });

    if (response.statusCode !== 200 && response.statusCode !== 201) {
      throw new Error(`Failed to create user: ${response.statusCode} - ${response.payload}`);
    }
    return {
      email: user.email,
      password: user.password,
    };
  }

  /**
   * Faz login e retorna o token
   */
  static async login(
    app: FastifyInstance,
    credentials: { email: string; password: string }
  ): Promise<LoginOutputDto> {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: credentials,
    });

    if (response.statusCode !== 200) {
      throw new Error(`Failed to login: ${response.statusCode} - ${response.payload}`);
    }

    return JSON.parse(response.payload);
  }

  /**
   * Cria um usuário e faz login automaticamente
   */
  static async createUserAndLogin(
    app: FastifyInstance,
    userData: Partial<TestUser> = {}
  ): Promise<LoginOutputDto> {
    try {    
    const credentials = await this.createUser(app, userData);
    return this.login(app, credentials);
    } catch (error) {
        console.log('Error in createUserAndLogin:', error);
        throw error;
    }
  }

  /**
   * Retorna headers de autorização para requisições autenticadas
   */
  static getAuthHeaders(token: string) {
    return {
      authorization: `Bearer ${token}`,
    };
  }
}
