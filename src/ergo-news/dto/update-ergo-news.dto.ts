import { PartialType } from '@nestjs/swagger';
import { CreateErgoNewsDto } from './create-ergo-news.dto';

export class UpdateErgoNewsDto extends PartialType(CreateErgoNewsDto) {}
