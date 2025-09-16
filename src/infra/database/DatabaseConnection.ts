import { PrismaClient } from "../../../generated/prisma";

export class DatabaseConnection {
    private static CLIENT: PrismaClient | undefined;
    private constructor() { }

    public static getConnection() {
        if (!DatabaseConnection.CLIENT) {
            DatabaseConnection.CLIENT = new PrismaClient();
        }

        return DatabaseConnection.CLIENT;
    }
}
