import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConvidadoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsNumber()
  @Type(() => Number)
  eventoId: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
