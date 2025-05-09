import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
  @IsString({ message: "O campo 'Nome' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Nome' não pode estar vazio." })
  readonly name: string;

  @IsString({ message: "O campo 'Email' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Email' não pode estar vazio." })
  readonly email: string;
}
