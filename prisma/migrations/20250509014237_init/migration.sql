/*
  Warnings:

  - You are about to drop the `history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipment_shipping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."history" DROP CONSTRAINT "history_shipment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."history" DROP CONSTRAINT "history_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."shipment" DROP CONSTRAINT "shipment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."shipment_shipping" DROP CONSTRAINT "shipment_shipping_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."shipment_shipping" DROP CONSTRAINT "shipment_shipping_shippingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."shipping" DROP CONSTRAINT "shipping_user_id_fkey";

-- DropTable
DROP TABLE "public"."history";

-- DropTable
DROP TABLE "public"."mail";

-- DropTable
DROP TABLE "public"."shipment";

-- DropTable
DROP TABLE "public"."shipment_shipping";

-- DropTable
DROP TABLE "public"."shipping";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment" (
    "id" SERIAL NOT NULL,
    "st" TEXT NOT NULL,
    "supply" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "invoice_issue_date" TIMESTAMP(3) NOT NULL,
    "destination" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "transport_mode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "Valeu_invoice" DECIMAL(65,30) NOT NULL,
    "name" TEXT,
    "transport" TEXT,
    "cpf" TEXT,
    "dispatch_date" TIMESTAMP(3),
    "dispatch_time" TEXT,
    "status" TEXT DEFAULT 'Pendente',
    "observation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "shipment_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "dispatch_date" TIMESTAMP(3) NOT NULL,
    "dispatch_time" TEXT,
    "transport" TEXT NOT NULL,
    "estimatedArrival" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Pendente',
    "statusEmail" TEXT,
    "isConfirm" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_shipping" (
    "shippingId" INTEGER NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_shipping_pkey" PRIMARY KEY ("shipmentId","shippingId")
);

-- CreateTable
CREATE TABLE "mail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "shipment_st_supply_invoice_number_idx" ON "shipment"("st", "supply", "invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_shipping_shipmentId_shippingId_key" ON "shipment_shipping"("shipmentId", "shippingId");

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_shipping" ADD CONSTRAINT "shipment_shipping_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "shipping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_shipping" ADD CONSTRAINT "shipment_shipping_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
