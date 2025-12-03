import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
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

  // Admin Route: List subscribers
  @Get('admin/newsletters')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findAll() {
    return this.newsletterService.findAll();
  }
}
