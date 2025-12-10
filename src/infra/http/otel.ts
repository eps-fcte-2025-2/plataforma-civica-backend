import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

let sdk: NodeSDK | null = null;

export async function startOtelIfEnabled() {
  const tracesEndpoint = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
  if (!tracesEndpoint) return; // desabilitado

  sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'api',
    traceExporter: new OTLPTraceExporter({ url: tracesEndpoint }),
    instrumentations: [
      getNodeAutoInstrumentations({
        // opcional: menos ruído
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  await sdk.start();

  const shutdown = async () => {
    try {
      await sdk?.shutdown();
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
