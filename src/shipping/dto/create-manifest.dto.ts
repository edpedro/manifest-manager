import { IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class CreateManifestDto {
  @IsNumber(
    {},
    { message: 'O shippingId do envio deve ser um número inteiro.' },
  )
  @IsNotEmpty({ message: 'O shippingId do envio é obrigatório.' })
  readonly shippingId: number;

  @IsArray({ message: 'O ID do carregamento deve ser um array.' })
  @IsNotEmpty({ message: 'O ID do carregamento é obrigatório.' })
  @IsNumber(
    {},
    { each: true, message: 'Cada item do array deve ser um número inteiro.' },
  )
  readonly shipmentId: number[];
}
