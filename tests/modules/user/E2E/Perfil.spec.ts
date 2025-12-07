import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../../../../src/infra/http/app';
import { DatabaseConnection } from '../../../../src/infra/database/DatabaseConnection';
import { SessionHelper } from '../../../utils/SessionHelper';
import { PrismaClientKnownRequestError } from '../../../../generated/prisma/runtime/library';

describe('Login e Perfil - Fluxo Completo E2E', () => {
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

    it('deve fazer login e depois buscar o perfil do usuário autenticado', async () => {
        // Act - Criar usuário e fazer login
        const session = await SessionHelper.createUserAndLogin(app, {
            email: 'joao@email.com',
            password: 'senha123',
            name: 'João Silva',
            role: 'ADMIN',
        });

        // Assert - Login bem-sucedido
        expect(session.token).toBeDefined();
        expect(session.user.email).toBe('joao@email.com');
        expect(session.user.name).toBe('João Silva');
        expect(session.user.role).toBe('ADMIN');

        // Act - Buscar perfil com token
        const profileResponse = await app.inject({
            method: 'GET',
            url: '/auth/me',
            headers: SessionHelper.getAuthHeaders(session.token),
        });

        const profile = JSON.parse(profileResponse.payload);

        // Assert - Perfil retornado corretamente
        expect(profileResponse.statusCode).toBe(200);
        expect(profile.id).toBe(session.user.id);
        expect(profile.email).toBe(session.user.email);
        expect(profile.name).toBe(session.user.name);
        expect(profile.role).toBe(session.user.role);
    });

    it('deve permitir login e consulta de perfil para MODERATOR', async () => {
        // Act - Criar e logar como MODERATOR
        const session = await SessionHelper.createUserAndLogin(app, {
            email: 'maria@email.com',
            password: 'senha456',
            name: 'Maria Santos',
            role: 'MODERATOR',
        });

        // Assert - Login
        expect(session.user.role).toBe('MODERATOR');

        // Act - Buscar perfil
        const profileResponse = await app.inject({
            method: 'GET',
            url: '/auth/me',
            headers: SessionHelper.getAuthHeaders(session.token),
        });

        const profile = JSON.parse(profileResponse.payload);

        // Assert - Perfil
        expect(profileResponse.statusCode).toBe(200);
        expect(profile.role).toBe('MODERATOR');
        expect(profile.name).toBe('Maria Santos');
    });

    it('deve permitir login e consulta de perfil para SUPER_ADMIN', async () => {
        // Act - Criar e logar como SUPER_ADMIN
        const session = await SessionHelper.createUserAndLogin(app, {
            email: 'super@email.com',
            password: 'supersenha',
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
        });

        // Assert - Login
        expect(session.user.role).toBe('SUPER_ADMIN');

        // Act - Buscar perfil
        const profileResponse = await app.inject({
            method: 'GET',
            url: '/auth/me',
            headers: SessionHelper.getAuthHeaders(session.token),
        });

        const profile = JSON.parse(profileResponse.payload);

        // Assert - Perfil
        expect(profileResponse.statusCode).toBe(200);
        expect(profile.role).toBe('SUPER_ADMIN');
    });

    it('deve retornar 401 ao buscar perfil sem token', async () => {
        // Act
        const response = await app.inject({
            method: 'GET',
            url: '/auth/me',
        });

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('deve retornar 401 ao buscar perfil com token inválido', async () => {
        // Act
        const response = await app.inject({
            method: 'GET',
            url: '/auth/me',
            headers: {
                authorization: 'Bearer token-invalido',
            },
        });

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('deve permitir acesso à rota de admin apenas para ADMINs', async () => {
        // Arrange - Criar usuário ADMIN
        const adminSession = await SessionHelper.createUserAndLogin(app, {
            email: 'admin@email.com',
            password: 'senha123',
            role: 'ADMIN',
        });

        // Act - Acessar rota de admin
        const response = await app.inject({
            method: 'GET',
            url: '/auth/admin/health',
            headers: SessionHelper.getAuthHeaders(adminSession.token),
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(200);
        expect(body.status).toBe('ok');
        expect(body.message).toBe('Admin access granted');
    });

    it('deve negar acesso à rota de admin para MODERATOR', async () => {
        // Arrange - Criar usuário MODERATOR
        const modSession = await SessionHelper.createUserAndLogin(app, {
            email: 'mod-no-access@email.com',
            password: 'senha123',
            role: 'MODERATOR',
        });

        // Act - Tentar acessar rota de admin
        const response = await app.inject({
            method: 'GET',
            url: '/auth/admin/health',
            headers: SessionHelper.getAuthHeaders(modSession.token),
        });

        const body = JSON.parse(response.payload);

        // Assert
        expect(response.statusCode).toBe(403);
        expect(body.message).toBe('Acesso negado. Permissões insuficientes.');
    });
});
