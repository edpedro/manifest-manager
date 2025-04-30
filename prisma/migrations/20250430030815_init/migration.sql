/*
  Warnings:

  - A unique constraint covering the columns `[user_id,shipment_id]` on the table `history` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "history_user_id_shipment_id_action_key";

-- CreateIndex
CREATE UNIQUE INDEX "history_user_id_shipment_id_key" ON "history"("user_id", "shipment_id");
