-- AlterTable
ALTER TABLE "shipment" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'Pendente';
