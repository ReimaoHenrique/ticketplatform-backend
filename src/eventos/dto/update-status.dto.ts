import { IsString, IsNotEmpty, IsIn, IsEmail } from 'class-validator';

export class UpdateStatusDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pendente', 'confirmado', 'cancelado'])
  status: string;
}
