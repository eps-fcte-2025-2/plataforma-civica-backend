import { z } from "zod";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const rawEnv = dotenv.config();
dotenvExpand.expand(rawEnv);
if (rawEnv.error) {
    throw rawEnv.error;
}

const envSchema = z.object({
    PORT: z.string().regex(/^\d+$/).transform(Number).default(3333),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.string().regex(/^\d+$/).transform(Number),
    DATABASE_URL: z.string()
});

const colorCode = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
} as const;
function ColoredText(text: string, color: keyof typeof colorCode) {
    return `${colorCode[color]}${text}\x1b[0m`;
}

const parsedEnv = envSchema.safeParse(rawEnv.parsed);
if (parsedEnv.success === false) {
    console.log("\n\n" + "=".repeat(80));
    console.log(ColoredText("Error when trying to validate .env", "red"));
    console.log(
        ColoredText(
            "Please, create and validate .env file in the root of the backend folder\n",
            "yellow",
        ),
    );

    console.log("ERRORS:");
    for (const [error, message] of Object.entries(
        parsedEnv.error.flatten().fieldErrors,
    )) {
        if (error === "_errors") {
            continue;
        }

        const formattedMessage = message.join(", ");

        console.log(
            `${ColoredText(error, "green")} - ${ColoredText(formattedMessage, "red")}`,
        );
    }
    console.log("=".repeat(80));
    process.exit(1);
}

export const env = parsedEnv.data;
