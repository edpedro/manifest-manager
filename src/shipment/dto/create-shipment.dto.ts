import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateShipmentDto {
  @IsString({ message: "O campo 'ST' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'ST' não pode estar vazio." })
  readonly st: string;

  @IsString({ message: "O campo 'Supply' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Supply' não pode estar vazio." })
  readonly supply: string;

  @IsString({ message: "O campo 'Invoice Number' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Invoice Number' não pode estar vazio." })
  readonly invoice_number: string;

  @IsDateString(
    {},
    { message: "O campo 'Invoice Issue Date' deve ser uma data válida." },
  )
  @IsNotEmpty({ message: "O campo 'Invoice Issue Date' não pode estar vazio." })
  readonly invoice_issue_date: string;

  @IsString({ message: "O campo 'Destination' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Destination' não pode estar vazio." })
  readonly destination: string;

  @IsString({ message: "O campo 'Carrier' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Carrier' não pode estar vazio." })
  readonly carrier: string;

  @IsString({ message: "O campo 'Transport Mode' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Transport Mode' não pode estar vazio." })
  readonly transport_mode: string;

  @IsNumber(
    {},
    { message: "O campo 'Valeu_invoice' deve ser um número válido." },
  )
  @IsNotEmpty({ message: "O campo 'Valeu_invoice' não pode estar vazio." })
  readonly Valeu_invoice: number;

  @IsString({ message: "O campo 'Destination' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Destination' não pode estar vazio." })
  readonly category: string;

  @IsString({ message: "O campo 'Name' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Name' não pode estar vazio." })
  readonly name?: string;

  @IsString({ message: "O campo 'Transport' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Transport' não pode estar vazio." })
  readonly transport?: string;

  @IsString({ message: "O campo 'CPF' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'CPF' não pode estar vazio." })
  readonly cpf?: string;

  @IsDateString(
    {},
    { message: "O campo 'Dispatch Date' deve ser uma data válida." },
  )
  @IsNotEmpty({ message: "O campo 'Dispatch Date' não pode estar vazio." })
  readonly dispatch_date?: string;

  @IsString({ message: "O campo 'Dispatch Time' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Dispatch Time' não pode estar vazio." })
  readonly dispatch_time?: string;

  @IsString({ message: "O campo 'status' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'status' não pode estar vazio." })
  readonly status?: string;

  @IsString({ message: "O campo 'observation' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'observation' não pode estar vazio." })
  readonly observation?: string;

  @IsString({ message: "O campo 'user_id' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'user_id Time' não pode estar vazio." })
  readonly user_id: string;
}
