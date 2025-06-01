import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceManifestDto {
  @IsNumber(
    {},
    { message: 'O shippingId do envio deve ser um número inteiro.' },
  )
  @IsNotEmpty({ message: 'O shippingId do envio é obrigatório.' })
  readonly shippingId: number;

  @IsString({ message: "O campo 'search' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'search' não pode estar vazio." })
  readonly search: string;
}
