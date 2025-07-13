import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateStatusByIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pendente', 'confirmado', 'cancelado'])
  status: string;
}
