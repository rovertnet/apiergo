import { IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNewsletterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
