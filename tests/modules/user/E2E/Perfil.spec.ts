import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { app } from '../../../../src/infra/http/app';
import { SessionHelper } from '../../../utils/SessionHelper';
import { setupE2ETest } from '../../../setup/e2eSetup';

describe('Login e Perfil - Fluxo Completo E2E', () => {
    setupE2ETest();

    it('deve fazer login e depois buscar o perfil do usuário autenticado', async () => {
        const payload = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
            role: 'ADMIN' as const,
        };

        // Act - Criar usuário e fazer login
        const session = await SessionHelper.createUserAndLogin(app, payload);

        // Assert - Login bem-sucedido
        expect(session.token).toBeDefined();
        expect(session.user.email).toBe(payload.email);
        expect(session.user.name).toBe(payload.name);
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
            name: 'Maria Santos', 
            role: 'MODERATOR' 
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
