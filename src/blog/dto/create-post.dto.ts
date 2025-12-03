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

export class CreatePostDto {
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

  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualText)
  postText: MultilingualText;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsInt()
  @IsNotEmpty()
  postCategoryId: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
