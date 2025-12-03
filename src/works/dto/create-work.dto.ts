import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

class MultilingualText {
  @IsString()
  @IsNotEmpty()
  fr: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  description: MultilingualText;

  @IsUrl()
  @IsNotEmpty()
  img: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsInt()
  status?: number;
}
