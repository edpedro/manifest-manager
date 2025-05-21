import { IsNotEmpty, IsEmail } from 'class-validator';

export class PasswordUserDto {
  @IsEmail({}, { message: "O campo 'Email' deve ser um email válido." })
  @IsNotEmpty({ message: "O campo 'Email' não pode estar vazio." })
  readonly email: string;
}
