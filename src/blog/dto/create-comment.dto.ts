import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsUrl()
  img?: string;

  @IsInt()
  @IsNotEmpty()
  postBlogId: number;
}
