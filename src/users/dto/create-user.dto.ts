import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "O campo 'Nome' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Nome' não pode estar vazio." })
  readonly first_name: string;

  @IsString({ message: "O campo 'Sobrenome' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Sobrenome' não pode estar vazio." })
  readonly last_name: string;

  @IsEmail({}, { message: "O campo 'Email' deve ser um email válido." })
  @IsNotEmpty({ message: "O campo 'Email' não pode estar vazio." })
  readonly email: string;

  @IsString({ message: "O campo 'Usuario' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Usuario' não pode estar vazio." })
  readonly username: string;

  @IsString({ message: "O campo 'Senha' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'Senha' não pode estar vazio." })
  readonly password: string;
}
