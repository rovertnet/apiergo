import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CreateErgoNewsDto } from './dto/create-ergo-news.dto';
import { UpdateErgoNewsDto } from './dto/update-ergo-news.dto';
import { ErgoNewsService } from './ergo-news.service';

@ApiTags('Ergo News')
@Controller()
@UseInterceptors(CacheInterceptor)
export class ErgoNewsController {
  constructor(private readonly ergoNewsService: ErgoNewsService) {}

  // Public Routes
  @Public()
  @Get('ergo-thematiques/ergo-news')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('lang') lang: string = 'fr',
  ) {
    return this.ergoNewsService.findAll(Number(page), Number(limit), lang);
  }

  @Public()
  @Get('ergo-thematiques/ergo-news/:slug')
  findOne(@Param('slug') slug: string) {
    return this.ergoNewsService.findOne(slug);
  }

  // Admin Routes
  @Post('admin/ergo-news')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  create(@Body() createErgoNewsDto: CreateErgoNewsDto, @CurrentUser() user: any) {
    return this.ergoNewsService.create(createErgoNewsDto, user.id);
  }

  @Get('admin/ergo-news')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findAllAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.ergoNewsService.findAll(Number(page), Number(limit));
  }

  @Put('admin/ergo-news/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateErgoNewsDto: UpdateErgoNewsDto,
    @CurrentUser() user: any,
  ) {
    return this.ergoNewsService.update(id, updateErgoNewsDto, user.id);
  }

  @Delete('admin/ergo-news/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.ergoNewsService.remove(id, user.id);
  }
}
