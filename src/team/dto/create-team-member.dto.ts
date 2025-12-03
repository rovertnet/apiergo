import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

class MultilingualText {
  @IsString()
  @IsNotEmpty()
  fr: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

class SocialNetwork {
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;
}

export class CreateTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUrl()
  @IsNotEmpty()
  img: string;

  @IsString()
  @IsNotEmpty()
  sex: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  description?: MultilingualText;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialNetwork)
  socialNetwork?: SocialNetwork;

  @IsInt()
  @IsNotEmpty()
  teamRoleId: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
