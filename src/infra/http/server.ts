import { app } from './app';
import { env } from '../../config/envConfig';

// Rotas Públicas
import { publicRoutes } from '../../modules/public/infra/routes/publicRoutes';
app.register(publicRoutes, {
  prefix: '/v1/public',
});

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  app.log.info(`HTTP Server running at: http://localhost:${env.PORT}`);
});
