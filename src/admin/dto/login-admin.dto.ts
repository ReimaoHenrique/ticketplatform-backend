import { IsString } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  hash: string;
}

