import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnersService } from './partners.service';

@ApiTags('Partners')
@Controller()
@UseInterceptors(CacheInterceptor)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // Public Route
  @Public()
  @Get('partners')
  findAll() {
    return this.partnersService.findAll();
  }

  // Admin Routes
  @Post('admin/partners')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Get('admin/partners/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.findOne(id);
  }

  @Put('admin/partners/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Delete('admin/partners/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnersService.remove(id);
  }
}
