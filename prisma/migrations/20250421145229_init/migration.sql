/*
  Warnings:

  - Changed the type of `Valeu_invoice` on the `shipment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "shipment" DROP COLUMN "Valeu_invoice",
ADD COLUMN     "Valeu_invoice" DECIMAL(65,30) NOT NULL;
