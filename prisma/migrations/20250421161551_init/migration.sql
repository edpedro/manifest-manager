/*
  Warnings:

  - A unique constraint covering the columns `[supply]` on the table `shipment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "shipment_invoice_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "shipment_supply_key" ON "shipment"("supply");
