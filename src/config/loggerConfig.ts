import pino from 'pino';
import { env } from './envConfig';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: env.LOG_LEVEL || 'info',
  formatters: {
    level: label => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
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
});

export type Logger = typeof logger;
