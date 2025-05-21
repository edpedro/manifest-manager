import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordUserDto {
  @IsString({ message: "O campo 'Token' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'token' não pode estar vazio." })
  readonly token: string;

  @IsString({ message: "O campo 'Senha' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Senha' não pode estar vazio." })
  readonly password: string;
}
