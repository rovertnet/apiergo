import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    const member = await this.prisma.ourTeam.create({
      data: {
        ...createTeamMemberDto,
        description: createTeamMemberDto.description as any,
        socialNetwork: createTeamMemberDto.socialNetwork as any,
      },
      include: {
        role: true,
      },
    });

    return member;
  }

  async findAll() {
    return this.prisma.ourTeam.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        role: true,
      },
    });
  }

  async findOne(id: number) {
    const member = await this.prisma.ourTeam.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`Membre #${id} non trouvé`);
    }

    return member;
  }

  async update(id: number, updateTeamMemberDto: UpdateTeamMemberDto) {
    const member = await this.prisma.ourTeam.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Membre #${id} non trouvé`);
    }

    const updatedMember = await this.prisma.ourTeam.update({
      where: { id },
      data: {
        ...updateTeamMemberDto,
        description: updateTeamMemberDto.description as any,
        socialNetwork: updateTeamMemberDto.socialNetwork as any,
      },
      include: {
        role: true,
      },
    });

    return updatedMember;
  }

  async remove(id: number) {
    const member = await this.prisma.ourTeam.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Membre #${id} non trouvé`);
    }

    return this.prisma.ourTeam.delete({
      where: { id },
    });
  }
}
