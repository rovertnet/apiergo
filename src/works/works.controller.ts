import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { WorksService } from './works.service';

@ApiTags('Works')
@Controller()
@UseInterceptors(CacheInterceptor)
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  // Public Route
  @Public()
  @Get('works')
  findAll() {
    return this.worksService.findAll();
  }

  // Admin Routes
  @Post('admin/works')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.worksService.create(createWorkDto);
  }

  @Get('admin/works/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.worksService.findOne(id);
  }

  @Put('admin/works/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkDto: UpdateWorkDto,
  ) {
    return this.worksService.update(id, updateWorkDto);
  }

  @Delete('admin/works/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.worksService.remove(id);
  }
}
