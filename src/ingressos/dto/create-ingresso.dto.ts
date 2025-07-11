import { IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateIngressoDto {
  @IsString()
  eventoId: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato xxx.xxx.xxx-xx',
  })
  cpf: string;

  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  status?: string;
}

