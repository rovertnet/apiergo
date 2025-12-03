import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class MultilingualText {
  @IsString()
  @IsNotEmpty()
  fr: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

export class CreateTeamRoleDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  name: MultilingualText;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
