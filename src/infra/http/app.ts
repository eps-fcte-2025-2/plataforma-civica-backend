import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '../../config/envConfig';
import { exampleRoutes } from '../../modules/example/infra/routes/exampleRoutes';
import { userRoutes } from '../../modules/user/infra/routes/userRoutes';
import { HttpError } from '../../shared/errors/interface/HttpError';
import { metricsCollectorPlugin } from '../../shared/middlewares/metricsCollector';
import { requestLoggerPlugin } from '../../shared/middlewares/requestLogger';
import { metricsRoutes } from './routes/metricsRoutes';

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
app.register(fastifyCors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
});

// JWT
app.register(fastifyJwt, { secret: env.JWT_SECRET });

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API - Denuncias de Apostas',
      version: '1.0.0',
      description: 'API para gerenciamento de denúncias de apostas esportivas',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

// Rotas:
app.register(metricsRoutes); // expõe /metrics e /health
app.register(exampleRoutes, {
  prefix: '/example',
});
app.register(userRoutes); // expõe /users, /sessions, /me, /admin/health

// Rotas de Reports
import { reportsRoutes } from '../../modules/reports/infra/routes/reportsRoutes';
app.register(reportsRoutes, {
  prefix: '/v1/reports',
});

// Rotas de Chatbot
import { messageRoutes } from '../../modules/chatbot/infra/routes/messagingRoutes';
app.register(messageRoutes, {
  prefix: '/v1/chatbot',
});

// Error Handler
app.setErrorHandler((error: unknown, _, reply) => {
  // Type guard for validation error
  if (
    error instanceof Error &&
    'validation' in error &&
    Array.isArray((error as any).validation)
  ) {
    return reply.status(422).send({
      message: 'Validation failed',
      issues: (error as any).validation,
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
    message: 'INTERNAL SERVER ERROR',
  });
});

// Listen
export { app };
