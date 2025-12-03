import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

class MultilingualText {
  @IsString()
  @IsNotEmpty()
  fr: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

class BackgroundImage {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}

export class CreateEventDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  title: MultilingualText;

  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  description: MultilingualText;

  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  details: MultilingualText;

  @IsObject()
  @ValidateNested()
  @Type(() => BackgroundImage)
  bgImg: BackgroundImage;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsArray()
  @IsUrl({}, { each: true })
  imgs: string[];

  @IsArray()
  @IsUrl({}, { each: true })
  videos: string[];

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
