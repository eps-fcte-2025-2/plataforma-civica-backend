// Rotas Públicas
import { publicRoutes } from '../../modules/public/infra/routes/publicRoutes.js';

async function main() {
  // Só liga OTel se tiver endpoint configurado no container (K8s)
  if (process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) {
    const { startOtelIfEnabled } = await import('./otel.js');
    await startOtelIfEnabled();
  }

  // Importa o app DEPOIS do OTel
  const { app } = await import('./app.js');
  const { env } = await import('../../config/envConfig.js');

  app.register(publicRoutes, { prefix: '/v1/public' });

  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  app.log.info(`HTTP Server running at: http://localhost:${env.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
