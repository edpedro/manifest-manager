/*
  Warnings:

  - The primary key for the `history` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "history_user_id_shipment_id_key";

-- AlterTable
ALTER TABLE "history" DROP CONSTRAINT "history_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "history_pkey" PRIMARY KEY ("id");
