import { IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateIngressoDto {
  @IsString()
  eventoId: string;

  @IsOptional()
  @IsString()
  nomeEvento?: string; // Nome do evento/festa

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato xxx.xxx.xxx-xx',
  })
  cpf?: string; // CPF agora é opcional

  @IsString()
  nome: string;

  @IsOptional()
  @IsEmail()
  email?: string; // Email agora é opcional

  @IsOptional()
  @IsString()
  status?: string;
}
