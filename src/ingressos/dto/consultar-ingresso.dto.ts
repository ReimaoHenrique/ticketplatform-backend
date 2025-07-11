import { IsOptional, IsString, Matches } from 'class-validator';

export class ConsultarIngressoDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato xxx.xxx.xxx-xx',
  })
  cpf?: string;

  @IsOptional()
  @IsString()
  nome?: string;
}

