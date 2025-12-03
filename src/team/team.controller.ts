import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamService } from './team.service';

@ApiTags('Team')
@Controller()
@UseInterceptors(CacheInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // Public Route
  @Public()
  @Get('team')
  findAll() {
    return this.teamService.findAll();
  }

  // Admin Routes
  @Post('admin/team')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamService.create(createTeamMemberDto);
  }

  @Get('admin/team/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Put('admin/team/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    return this.teamService.update(id, updateTeamMemberDto);
  }

  @Delete('admin/team/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.remove(id);
  }
}
