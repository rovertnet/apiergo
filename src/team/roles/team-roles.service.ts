import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamRoleDto } from '../dto/create-team-role.dto';

@Injectable()
export class TeamRolesService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamRoleDto: CreateTeamRoleDto) {
    const existingRole = await this.prisma.teamRole.findUnique({
      where: { code: createTeamRoleDto.code },
    });

    if (existingRole) {
      throw new ConflictException('Ce code de rôle est déjà utilisé');
    }

    return this.prisma.teamRole.create({
      data: {
        ...createTeamRoleDto,
        name: createTeamRoleDto.name as any,
      },
    });
  }

  async findAll() {
    return this.prisma.teamRole.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.teamRole.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Rôle #${id} non trouvé`);
    }

    return role;
  }

  async remove(id: number) {
    const role = await this.prisma.teamRole.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Rôle #${id} non trouvé`);
    }

    // Check if role is used
    const membersCount = await this.prisma.ourTeam.count({
      where: { teamRoleId: id },
    });

    if (membersCount > 0) {
      throw new ConflictException('Ce rôle est assigné à des membres de l\'équipe et ne peut pas être supprimé');
    }

    return this.prisma.teamRole.delete({
      where: { id },
    });
  }
}
