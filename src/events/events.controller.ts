import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller()
@UseInterceptors(CacheInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Public Routes
  @Public()
  @Get('actualites/evenements')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('lang') lang: string = 'fr',
  ) {
    return this.eventsService.findAll(Number(page), Number(limit), lang);
  }

  @Public()
  @Get('actualites/evenements/:slug')
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findOne(slug);
  }

  // Admin Routes
  @Post('admin/events')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get('admin/events')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findAllAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.eventsService.findAll(Number(page), Number(limit));
  }

  @Put('admin/events/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete('admin/events/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
