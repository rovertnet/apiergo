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

export class CreateErgoNewsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  title: MultilingualText;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  description: MultilingualText;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
