import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { exampleRoutes } from "../../modules/example/infra/routes/exampleRoutes";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "../../config/envConfig";
import { HttpError } from "../../shared/errors/interface/HttpError";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "../../modules/user/infra/routes/userRoutes";
import { requestLoggerPlugin } from "../../shared/middlewares/requestLogger";
import { metricsCollectorPlugin } from "../../shared/middlewares/metricsCollector";
import { metricsRoutes } from "./routes/metricsRoutes";

const isDevelopment = process.env.NODE_ENV !== 'production';

const app = fastify({
    logger: {
        level: env.LOG_LEVEL || 'info',
        ...(isDevelopment && {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
        }),
    },
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Request Logger Middleware
app.register(requestLoggerPlugin);

// Metrics Collector Middleware
app.register(metricsCollectorPlugin);

// CORS
app.register(fastifyCors, { origin: "*" });

// JWT
app.register(fastifyJwt, { secret: env.JWT_SECRET });

// Swagger
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "API - Denuncias de Apostas",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
});


// Rotas:
app.register(metricsRoutes); // expõe /metrics e /health
app.register(exampleRoutes, {
    prefix: "/example"
});
app.register(userRoutes); // expõe /users, /sessions, /me, /admin/health

// Rotas de Reports
import { reportsRoutes } from "../../modules/reports/infra/routes/reportsRoutes";
app.register(reportsRoutes, {
    prefix: "/v1/reports"
});


// Error Handler
app.setErrorHandler((error, _, reply) => {
    if (error.validation) {
        return reply.status(422).send({
            message: "Validation failed",
            issues: error.validation,
        });
    }

    if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            message: error.message,
        });
    }

    app.log.error(error, 'Internal server error');
    reply.status(500).send({
        statusCode: 500,
        message: "INTERNAL SERVER ERROR"
    });
});

// Listen
app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
    app.log.info(`HTTP Server running at: http://localhost:${env.PORT}`);
});
