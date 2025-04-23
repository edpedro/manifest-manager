/*
  Warnings:

  - Added the required column `Valeu_invoice` to the `shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shipment" ADD COLUMN     "Valeu_invoice" TEXT NOT NULL;
