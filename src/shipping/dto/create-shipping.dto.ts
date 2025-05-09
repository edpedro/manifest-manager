import { IsString, IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';

export class CreateShippingDto {
  @IsString({ message: "O campo 'Name' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Name' não pode estar vazio." })
  readonly name: string;

  @IsString({ message: "O campo 'CPF' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'CPF' não pode estar vazio." })
  readonly cpf: string;

  @IsString({ message: "O campo 'placa' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'placa' não pode estar vazio." })
  readonly placa: string;

  @IsDateString(
    {},
    { message: "O campo 'Dispatch Date' deve ser uma data válida." },
  )
  @IsNotEmpty({ message: "O campo 'Dispatch Date' não pode estar vazio." })
  readonly dispatch_date: string;

  readonly dispatch_time?: string;

  @IsString({ message: "O campo 'Transport' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Transport' não pode estar vazio." })
  readonly transport: string;

  @IsString({ message: "O campo 'Estimated Arrival' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Estimated Arrival' não pode estar vazio." })
  readonly estimatedArrival: string;
}
