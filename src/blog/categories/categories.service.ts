import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.postCategoryBlog.findUnique({
      where: { code: createCategoryDto.code },
    });

    if (existingCategory) {
      throw new ConflictException('Ce code de catégorie est déjà utilisé');
    }

    return this.prisma.postCategoryBlog.create({
      data: {
        ...createCategoryDto,
        name: createCategoryDto.name as any,
      },
    });
  }

  async findAll() {
    return this.prisma.postCategoryBlog.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.postCategoryBlog.findUnique({
      where: { id },
    });

    if (!category || category.deletedAt) {
      throw new NotFoundException(`Catégorie #${id} non trouvée`);
    }

    return category;
  }

  async remove(id: number) {
    const category = await this.prisma.postCategoryBlog.findUnique({
      where: { id },
    });

    if (!category || category.deletedAt) {
      throw new NotFoundException(`Catégorie #${id} non trouvée`);
    }

    // Soft delete
    return this.prisma.postCategoryBlog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
