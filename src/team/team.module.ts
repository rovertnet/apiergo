import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamRolesController } from './roles/team-roles.controller';
import { TeamRolesService } from './roles/team-roles.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeamController, TeamRolesController],
  providers: [TeamService, TeamRolesService],
  exports: [TeamService],
})
export class TeamModule {}
