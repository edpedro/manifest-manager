export class ShipmentDto {
  id: number;
  st: string;
  supply: string;
  invoice_number: string;
  invoice_issue_date: Date;
  destination: string;
  city: string;
  uf: string;
  carrier: string;
  transport_mode: string;
  Valeu_invoice: number | null;
  category: string;
  name?: string | null;
  transport?: string | null;
  cpf?: string | null;
  dispatch_date?: Date | null;
  dispatch_time?: string | null;
  status?: string | null;
  observation?: string | null;
  user: {
    id: string;
    first_name: string;
  };
}
export interface ShipmentPendingDto extends ShipmentDto {
  cor?: string;
}
