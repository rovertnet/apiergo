import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL avatar invalide' })
  avatar?: string;

  @IsInt({ message: 'ID de rôle invalide' })
  @IsNotEmpty({ message: 'Le rôle est requis' })
  userRoleId: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
