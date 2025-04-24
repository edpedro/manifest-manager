import { IsString, IsNotEmpty } from 'class-validator';

export class DateShipmentDto {
  @IsString({ message: "O campo 'Data inicial' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Data inicial' não pode estar vazio." })
  readonly data_start: string;

  @IsString({ message: "O campo 'data final' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'data final' não pode estar vazio." })
  readonly date_end: string;
}
