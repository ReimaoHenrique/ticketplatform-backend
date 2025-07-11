import { IsString, IsNumber, IsDateString, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsOptional()
  @IsString()
  imagem?: string;

  @IsDateString()
  data: string;

  @IsString()
  local: string;

  @IsNumber()
  @IsPositive()
  preco: number;

  @IsNumber()
  @Min(0)
  ingressosDisponiveis: number;

  @IsNumber()
  @IsPositive()
  ingressosTotal: number;

  @IsOptional()
  @IsString()
  linkPagamento?: string;

  @IsOptional()
  @IsString()
  termosUso?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

