import client from 'prom-client';

// Cria um registro para as métricas
export const register = new client.Registry();

// Adiciona métricas padrão do Node.js (CPU, memória, etc)
client.collectDefaultMetrics({ register });

// Métrica: Contador de requisições HTTP
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Métrica: Histograma de latência das requisições
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5], // buckets em segundos
  registers: [register],
});

// Métrica: Contador de erros HTTP (status >= 400)
export const httpErrorCounter = new client.Counter({
  name: 'http_errors_total',
  help: 'Total de erros HTTP (status >= 400)',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Métrica: Gauge para requisições em andamento
export const httpRequestsInProgress = new client.Gauge({
  name: 'http_requests_in_progress',
  help: 'Número de requisições HTTP em andamento',
  labelNames: ['method'],
  registers: [register],
});
