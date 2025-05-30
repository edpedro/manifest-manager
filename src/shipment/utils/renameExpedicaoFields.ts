import { ShipmentDto } from '../dto/shipment.dto';

const FIELD_NAMES = {
  st: 'ST',
  supply: 'Fornecimento',
  invoice_number: 'Nota fiscal',
  invoice_issue_date: 'Data de Emissão da NF',
  destination: 'Destinatario',
  city: 'Cidade',
  uf: 'UF',
  carrier: 'Transportadora',
  transport_mode: 'Modal',
  Valeu_invoice: 'Valor',
  category: 'Categoria',
  status: 'Status',
  name: 'Nome',
  transport: 'Transporte',
  cpf: 'CPF',
  dispatch_date: 'Data Expedição',
  dispatch_time: 'Hora Expedição',
};

export async function renameExpedicaoFields(results: ShipmentDto[]) {
  return results.map((result) => {
    return Object.fromEntries(
      Object.entries(result)
        .filter(([key]) => FIELD_NAMES[key])
        .map(([key, value]) => [FIELD_NAMES[key], value]),
    );
  });
}
