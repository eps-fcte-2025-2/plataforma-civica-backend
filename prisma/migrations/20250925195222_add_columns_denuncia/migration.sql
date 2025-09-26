-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'ARQUIVADA');

-- AlterTable
ALTER TABLE "public"."Denuncia" ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDENTE';
