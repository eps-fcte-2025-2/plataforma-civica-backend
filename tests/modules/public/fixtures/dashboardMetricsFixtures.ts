export const SAMPLE_METRICS = {
  totalDenuncias: 42,
  denunciasPorStatus: {
    pendentes: 1,
    emAnalise: 2,
    aprovadas: 3,
    rejeitadas: 4,
    arquivadas: 5,
  },
  denunciasPorTipo: {
    partidaEspecifica: 6,
    esquemaManipulacao: 7,
  },
  denunciasPorRegiao: [{ uf: 'SP', total: 10 }],
  dadosParaMapa: [{ municipio: 'São Paulo', uf: 'SP', total: 10 }],
  evolucaoTemporal: [{ periodo: '2025-12', total: 12 }],
};

export const EMPTY_METRICS = {
  totalDenuncias: 0,
  denunciasPorStatus: {
    pendentes: 0,
    emAnalise: 0,
    aprovadas: 0,
    rejeitadas: 0,
    arquivadas: 0,
  },
  denunciasPorTipo: {
    partidaEspecifica: 0,
    esquemaManipulacao: 0,
  },
  denunciasPorRegiao: [],
  dadosParaMapa: [],
  evolucaoTemporal: [],
};
