import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTeamRoleDto } from '../dto/create-team-role.dto';
import { TeamRolesService } from './team-roles.service';

@Controller('admin/team/roles')
@UseGuards(RolesGuard)
@Roles('admin', 'editor')
export class TeamRolesController {
  constructor(private readonly teamRolesService: TeamRolesService) {}

  @Post()
  create(@Body() createTeamRoleDto: CreateTeamRoleDto) {
    return this.teamRolesService.create(createTeamRoleDto);
  }

  @Get()
  findAll() {
    return this.teamRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamRolesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamRolesService.remove(id);
  }
}
