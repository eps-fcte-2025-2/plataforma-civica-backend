/*
  Warnings:

  - You are about to drop the column `municipioId` on the `Denuncia` table. All the data in the column will be lost.
  - You are about to drop the column `municipioId` on the `Partida` table. All the data in the column will be lost.
  - You are about to drop the `Municipio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `municipio` to the `Denuncia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `Denuncia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipio` to the `Partida` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `Partida` table without a default value. This is not possible if the table is not empty.

*/

-- Primeiro adicionar as colunas como nullable para permitir a migração
ALTER TABLE "public"."Denuncia" ADD COLUMN "municipio" TEXT;
ALTER TABLE "public"."Denuncia" ADD COLUMN "uf" TEXT;
ALTER TABLE "public"."Partida" ADD COLUMN "municipio" TEXT;
ALTER TABLE "public"."Partida" ADD COLUMN "uf" TEXT;

-- Copiar dados da tabela Municipio para os novos campos
UPDATE "public"."Denuncia" 
SET municipio = m.nome, uf = m.uf 
FROM "public"."Municipio" m 
WHERE "Denuncia"."municipioId" = m.id;

UPDATE "public"."Partida" 
SET municipio = m.nome, uf = m.uf 
FROM "public"."Municipio" m 
WHERE "Partida"."municipioId" = m.id;

-- Agora tornar as colunas NOT NULL
ALTER TABLE "public"."Denuncia" ALTER COLUMN "municipio" SET NOT NULL;
ALTER TABLE "public"."Denuncia" ALTER COLUMN "uf" SET NOT NULL;
ALTER TABLE "public"."Partida" ALTER COLUMN "municipio" SET NOT NULL;
ALTER TABLE "public"."Partida" ALTER COLUMN "uf" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "public"."Denuncia" DROP CONSTRAINT "Denuncia_municipioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Partida" DROP CONSTRAINT "Partida_municipioId_fkey";

-- Remover as colunas municipioId
ALTER TABLE "public"."Denuncia" DROP COLUMN "municipioId";
ALTER TABLE "public"."Partida" DROP COLUMN "municipioId";

-- DropTable
DROP TABLE "public"."Municipio";
