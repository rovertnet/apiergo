import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

@Injectable()
export class WorksService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkDto: CreateWorkDto) {
    const existingWork = await this.prisma.ourWork.findUnique({
      where: { title: createWorkDto.title },
    });

    if (existingWork) {
      throw new ConflictException('Ce titre est déjà utilisé');
    }

    const work = await this.prisma.ourWork.create({
      data: {
        ...createWorkDto,
        description: createWorkDto.description as any,
        images: createWorkDto.images as any,
      },
    });

    return this.transformWork(work);
  }

  async findAll() {
    const works = await this.prisma.ourWork.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return works.map((work) => this.transformWork(work));
  }

  async findOne(id: number) {
    const work = await this.prisma.ourWork.findUnique({
      where: { id: BigInt(id) },
    });

    if (!work) {
      throw new NotFoundException(`Réalisation #${id} non trouvée`);
    }

    return this.transformWork(work);
  }

  async update(id: number, updateWorkDto: UpdateWorkDto) {
    const work = await this.prisma.ourWork.findUnique({
      where: { id: BigInt(id) },
    });

    if (!work) {
      throw new NotFoundException(`Réalisation #${id} non trouvée`);
    }

    if (updateWorkDto.title && updateWorkDto.title !== work.title) {
      const existingWork = await this.prisma.ourWork.findUnique({
        where: { title: updateWorkDto.title },
      });

      if (existingWork) {
        throw new ConflictException('Ce titre est déjà utilisé');
      }
    }

    const updatedWork = await this.prisma.ourWork.update({
      where: { id: BigInt(id) },
      data: {
        ...updateWorkDto,
        description: updateWorkDto.description as any,
        images: updateWorkDto.images as any,
      },
    });

    return this.transformWork(updatedWork);
  }

  async remove(id: number) {
    const work = await this.prisma.ourWork.findUnique({
      where: { id: BigInt(id) },
    });

    if (!work) {
      throw new NotFoundException(`Réalisation #${id} non trouvée`);
    }

    return this.prisma.ourWork.delete({
      where: { id: BigInt(id) },
    });
  }

  private transformWork(work: any) {
    return {
      ...work,
      id: work.id.toString(),
    };
  }
}
