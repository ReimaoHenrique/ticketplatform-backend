import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';

export class ConsultarStatusDto {
  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty()
  cpf?: string;

  @ValidateIf((o) => !o.cpf)
  @IsString()
  @IsNotEmpty()
  email?: string;
}
