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
    "name" TEXT NOT NULL,
    "transport" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dispatch_date" TIMESTAMP(3) NOT NULL,
    "dispatch_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shipment_st_supply_invoice_number_idx" ON "shipment"("st", "supply", "invoice_number");

-- AddForeignKey
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
