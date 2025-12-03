import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsUrl()
  @IsNotEmpty()
  logo: string;

  @IsOptional()
  @IsUrl()
  lien?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
