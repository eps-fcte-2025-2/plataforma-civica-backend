-- CreateEnum
CREATE TYPE "public"."TipoDenuncia" AS ENUM ('PARTIDA_ESPECIFICA', 'ESQUEMA_DE_MANIPULACAO');

-- CreateEnum
CREATE TYPE "public"."ComoSoube" AS ENUM ('VITIMA', 'TERCEIROS', 'INTERNET', 'PRESENCIAL', 'OBSERVACAO', 'OUTROS');

-- CreateEnum
CREATE TYPE "public"."PontualOuDisseminado" AS ENUM ('PONTUAL', 'DISSEMINADO');

-- CreateEnum
CREATE TYPE "public"."Frequencia" AS ENUM ('ISOLADO', 'FREQUENTE');

-- CreateEnum
CREATE TYPE "public"."FocoManipulacao" AS ENUM ('ATLETAS_DIRIGENTES_COMISSAO', 'APOSTADORES', 'JUIZES');

-- CreateEnum
CREATE TYPE "public"."TipoEvidencia" AS ENUM ('DOCUMENTO', 'IMAGEM', 'VIDEO', 'AUDIO', 'OUTRO');

-- CreateTable
CREATE TABLE "public"."Denuncia" (
    "id" UUID NOT NULL,
    "tipoDenuncia" "public"."TipoDenuncia" NOT NULL,
    "descricao" TEXT NOT NULL,
    "comoSoube" "public"."ComoSoube",
    "pontualOuDisseminado" "public"."PontualOuDisseminado" NOT NULL DEFAULT 'PONTUAL',
    "frequencia" "public"."Frequencia" NOT NULL DEFAULT 'ISOLADO',
    "dataDenuncia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "municipioId" UUID NOT NULL,

    CONSTRAINT "Denuncia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Municipio" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Partida" (
    "id" UUID NOT NULL,
    "torneio" TEXT NOT NULL,
    "dataPartida" TIMESTAMP(3) NOT NULL,
    "localPartida" TEXT NOT NULL,
    "timeA" TEXT,
    "timeB" TEXT,
    "observacoes" TEXT,
    "denunciaId" UUID NOT NULL,
    "municipioId" UUID NOT NULL,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pessoa" (
    "id" UUID NOT NULL,
    "nomePessoa" TEXT NOT NULL,
    "funcaoPessoa" TEXT NOT NULL,
    "denunciaId" UUID,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Clube" (
    "id" UUID NOT NULL,
    "nomeClube" TEXT NOT NULL,
    "denunciaId" UUID,

    CONSTRAINT "Clube_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DenunciaFoco" (
    "id" UUID NOT NULL,
    "denunciaId" UUID NOT NULL,
    "foco" "public"."FocoManipulacao" NOT NULL,

    CONSTRAINT "DenunciaFoco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evidencia" (
    "id" UUID NOT NULL,
    "nomeOriginal" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "caminhoArquivo" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tipo" "public"."TipoEvidencia" NOT NULL,
    "descricao" TEXT,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "denunciaId" UUID NOT NULL,

    CONSTRAINT "Evidencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DenunciaFoco_denunciaId_foco_key" ON "public"."DenunciaFoco"("denunciaId", "foco");

-- AddForeignKey
ALTER TABLE "public"."Denuncia" ADD CONSTRAINT "Denuncia_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "public"."Municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Partida" ADD CONSTRAINT "Partida_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "public"."Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Partida" ADD CONSTRAINT "Partida_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "public"."Municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pessoa" ADD CONSTRAINT "Pessoa_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "public"."Denuncia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Clube" ADD CONSTRAINT "Clube_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "public"."Denuncia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DenunciaFoco" ADD CONSTRAINT "DenunciaFoco_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "public"."Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evidencia" ADD CONSTRAINT "Evidencia_denunciaId_fkey" FOREIGN KEY ("denunciaId") REFERENCES "public"."Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
