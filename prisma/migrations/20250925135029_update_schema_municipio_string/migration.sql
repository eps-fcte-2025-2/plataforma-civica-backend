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
-- DropForeignKey
ALTER TABLE "public"."Denuncia" DROP CONSTRAINT "Denuncia_municipioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Partida" DROP CONSTRAINT "Partida_municipioId_fkey";

-- AlterTable
ALTER TABLE "public"."Denuncia" DROP COLUMN "municipioId",
ADD COLUMN     "municipio" TEXT NOT NULL,
ADD COLUMN     "uf" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Partida" DROP COLUMN "municipioId",
ADD COLUMN     "municipio" TEXT NOT NULL,
ADD COLUMN     "uf" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Municipio";
