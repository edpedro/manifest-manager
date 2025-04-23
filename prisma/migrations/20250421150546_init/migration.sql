/*
  Warnings:

  - A unique constraint covering the columns `[invoice_number]` on the table `shipment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shipment_invoice_number_key" ON "shipment"("invoice_number");
