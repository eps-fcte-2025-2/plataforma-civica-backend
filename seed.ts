import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

// Enums manuais baseados no schema.prisma
enum TipoDenuncia {
  PARTIDA_ESPECIFICA = 'PARTIDA_ESPECIFICA',
  ESQUEMA_DE_MANIPULACAO = 'ESQUEMA_DE_MANIPULACAO',
}

enum ComoSoube {
  VITIMA = 'VITIMA',
  TERCEIROS = 'TERCEIROS',
  INTERNET = 'INTERNET',
  PRESENCIAL = 'PRESENCIAL',
  OBSERVACAO = 'OBSERVACAO',
  OUTROS = 'OUTROS',
}

enum PontualOuDisseminado {
  PONTUAL = 'PONTUAL',
  DISSEMINADO = 'DISSEMINADO',
}

enum Frequencia {
  ISOLADO = 'ISOLADO',
  FREQUENTE = 'FREQUENTE',
}

enum FocoManipulacao {
  ATLETAS_DIRIGENTES_COMISSAO = 'ATLETAS_DIRIGENTES_COMISSAO',
  APOSTADORES = 'APOSTADORES',
  JUIZES = 'JUIZES',
}

enum TipoEvidencia {
  DOCUMENTO = 'DOCUMENTO',
  IMAGEM = 'IMAGEM',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OUTRO = 'OUTRO',
}

async function main() {
  console.log('🌱 Iniciando seed de múltiplas denúncias...');

  for (let i = 1; i <= 10; i++) {
    const denuncia = await prisma.denuncia.create({
      data: {
        tipoDenuncia:
          i % 2 === 0 ? TipoDenuncia.ESQUEMA_DE_MANIPULACAO : TipoDenuncia.PARTIDA_ESPECIFICA,
        descricao: `Denúncia número ${i} sobre possível manipulação`,
        comoSoube: ComoSoube.INTERNET,
        pontualOuDisseminado:
          i % 3 === 0 ? PontualOuDisseminado.DISSEMINADO : PontualOuDisseminado.PONTUAL,
        frequencia: i % 2 === 0 ? Frequencia.FREQUENTE : Frequencia.ISOLADO,
        dataDenuncia: new Date(Date.now() - i * 86400000), // dias anteriores
        municipio: 'São Paulo',
        uf: 'SP',
      },
    });

    await prisma.partida.create({
      data: {
        torneio: `Torneio ${i}`,
        dataPartida: new Date(Date.now() - i * 86400000),
        localPartida: `Estádio ${i}`,
        timeA: `Time A${i}`,
        timeB: `Time B${i}`,
        observacoes: `Observações da partida ${i}`,
        municipio: 'São Paulo',
        uf: 'SP',
        denunciaId: denuncia.id,
      },
    });

    await prisma.pessoa.create({
      data: {
        nomePessoa: `Pessoa ${i}`,
        funcaoPessoa: i % 2 === 0 ? 'Árbitro' : 'Atleta',
        denunciaId: denuncia.id,
      },
    });

    await prisma.clube.create({
      data: {
        nomeClube: `Clube ${i}`,
        denunciaId: denuncia.id,
      },
    });

    await prisma.denunciaFoco.create({
      data: {
        foco: i % 2 === 0 ? FocoManipulacao.JUIZES : FocoManipulacao.APOSTADORES,
        denunciaId: denuncia.id,
      },
    });

    await prisma.evidencia.create({
      data: {
        nomeOriginal: `evidencia_${i}.mp4`,
        nomeArquivo: `arquivo_${i}.mp4`,
        caminhoArquivo: `/evidencias/arquivo_${i}.mp4`,
        tamanhoBytes: 1024 * i * 100,
        mimeType: 'video/mp4',
        tipo: TipoEvidencia.VIDEO,
        descricao: `Vídeo evidência ${i}`,
        denunciaId: denuncia.id,
      },
    });
  }

  console.log('✅ Seed de múltiplas denúncias completado com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Erro durante o seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
