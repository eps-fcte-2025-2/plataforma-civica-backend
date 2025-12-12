import { afterAll, beforeAll, beforeEach } from 'vitest';
import { app } from '../../src/infra/http/app';
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection';

export function setupE2ETest() {
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
}
