import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../../../../src/infra/http/app';
import { SessionHelper } from '../../../utils/SessionHelper';
import { DatabaseConnection } from '../../../../src/infra/database/DatabaseConnection';

describe('POST /auth/login - Testes E2E', () => {
    beforeAll(async () => {
        await app.ready();
    }, 30000);

    afterAll(async () => {
        const prisma = DatabaseConnection.getConnection();
        await prisma.$disconnect();
        await app.close();
    }, 30000);

    beforeEach(async () => {
        const prisma = DatabaseConnection.getConnection();
        await prisma.user.deleteMany({});
    });

    it('deve fazer login com credenciais válidas', async () => {
        // Arrange - Criar usuário
        const credentials = await SessionHelper.createUser(app, {
            email: 'test-login@email.com',
            password: 'senha123',
            name: 'Test User',
            role: 'ADMIN',
        });

        // Act - Fazer login
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: credentials,
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(body.token).toBeDefined();
        expect(body.user).toBeDefined();
        expect(body.user.email).toBe(credentials.email);
        expect(body.user.name).toBe('Test User');
        expect(body.user.role).toBe('ADMIN');
    });

    it('deve retornar erro 401 quando email não existir', async () => {
        // Act
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'inexistente@email.com',
                password: 'senha123',
            },
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(401);
        expect(body.message).toBe('Credenciais inválidas');
    });

    it('deve retornar erro 401 quando senha estiver incorreta', async () => {
        // Arrange - Criar usuário
        const credentials = await SessionHelper.createUser(app, {
            email: 'test-wrong-password@email.com',
            password: 'senhaCorreta',
        });

        // Act - Tentar login com senha errada
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: credentials.email,
                password: 'senhaErrada',
            },
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(401);
        expect(body.message).toBe('Credenciais inválidas');
    });

    it('deve fazer login com usuário MODERATOR', async () => {
        // Arrange
        const credentials = await SessionHelper.createUser(app, {
            email: 'moderator@email.com',
            password: 'senha456',
            name: 'Moderator User',
            role: 'MODERATOR',
        });

        // Act
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: credentials,
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(body.user.role).toBe('MODERATOR');
        expect(body.user.name).toBe('Moderator User');
    });

    it('deve fazer login com usuário SUPER_ADMIN', async () => {
        // Arrange
        const credentials = await SessionHelper.createUser(app, {
            email: 'superadmin@email.com',
            password: 'supersenha',
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
        });

        // Act
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: credentials,
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(body.user.role).toBe('SUPER_ADMIN');
        expect(body.user.name).toBe('Super Admin');
    });

    it('deve validar email no formato correto', async () => {
        // Act
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'email-invalido',
                password: 'senha123',
            },
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(422);
        expect(body.message).toBe('Validation failed');
        expect(body.issues).toBeDefined();
    });

    it('deve validar senha obrigatória', async () => {
        // Act
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'test@email.com',
                password: '',
            },
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(422);
        expect(body.message).toBe('Validation failed');
        expect(body.issues).toBeDefined();
    });
});
