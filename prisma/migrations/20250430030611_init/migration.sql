/*
  Warnings:

  - A unique constraint covering the columns `[user_id,shipment_id,action]` on the table `history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "history" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "history_user_id_shipment_id_action_key" ON "history"("user_id", "shipment_id", "action");
