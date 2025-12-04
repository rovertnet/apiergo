import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('Newsletter')
@Controller()
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  // Public Route: Subscribe
  @Public()
  @Post('newsletter')
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  // Admin Routes
  @Get('admin/newsletters')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findAll() {
    return this.newsletterService.findAll();
  }

  @Get('admin/newsletters/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsletterService.findOne(id);
  }

  @Put('admin/newsletters/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsletterDto: UpdateNewsletterDto,
  ) {
    return this.newsletterService.update(id, updateNewsletterDto);
  }

  @Delete('admin/newsletters/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsletterService.remove(id);
  }
}
