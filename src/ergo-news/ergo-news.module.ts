import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErgoNewsController } from './ergo-news.controller';
import { ErgoNewsService } from './ergo-news.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErgoNewsController],
  providers: [ErgoNewsService],
  exports: [ErgoNewsService],
})
export class ErgoNewsModule {}
