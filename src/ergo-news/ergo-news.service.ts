import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErgoNewsDto } from './dto/create-ergo-news.dto';
import { UpdateErgoNewsDto } from './dto/update-ergo-news.dto';

@Injectable()
export class ErgoNewsService {
  constructor(private prisma: PrismaService) {}

  async create(createErgoNewsDto: CreateErgoNewsDto, userId: number) {
    const existingNews = await this.prisma.ergoNews.findUnique({
      where: { slug: createErgoNewsDto.slug },
    });

    if (existingNews) {
      throw new ConflictException('Ce slug est déjà utilisé');
    }

    const news = await this.prisma.ergoNews.create({
      data: {
        ...createErgoNewsDto,
        title: createErgoNewsDto.title as any,
        description: createErgoNewsDto.description as any,
      },
    });

    return this.transformNews(news);
  }

  async findAll(page = 1, limit = 10, lang = 'fr') {
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.prisma.ergoNews.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ergoNews.count({ where: { deletedAt: null } }),
    ]);

    return {
      data: news.map((item) => this.transformNews(item)),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string) {
    const news = await this.prisma.ergoNews.findUnique({
      where: { slug },
    });

    if (!news || news.deletedAt) {
      throw new NotFoundException(`Actualité non trouvée`);
    }

    return this.transformNews(news);
  }

  async update(id: number, updateErgoNewsDto: UpdateErgoNewsDto, userId: number) {
    const news = await this.prisma.ergoNews.findUnique({
      where: { id: BigInt(id) },
    });

    if (!news || news.deletedAt) {
      throw new NotFoundException(`Actualité #${id} non trouvée`);
    }

    if (updateErgoNewsDto.slug && updateErgoNewsDto.slug !== news.slug) {
      const existingNews = await this.prisma.ergoNews.findUnique({
        where: { slug: updateErgoNewsDto.slug },
      });

      if (existingNews) {
        throw new ConflictException('Ce slug est déjà utilisé');
      }
    }

    const updatedNews = await this.prisma.ergoNews.update({
      where: { id: BigInt(id) },
      data: {
        ...updateErgoNewsDto,
        title: updateErgoNewsDto.title as any,
        description: updateErgoNewsDto.description as any,
      },
    });

    return this.transformNews(updatedNews);
  }

  async remove(id: number, userId: number) {
    const news = await this.prisma.ergoNews.findUnique({
      where: { id: BigInt(id) },
    });

    if (!news || news.deletedAt) {
      throw new NotFoundException(`Actualité #${id} non trouvée`);
    }

    await this.prisma.ergoNews.update({
      where: { id: BigInt(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'Actualité supprimée avec succès' };
  }

  private transformNews(news: any) {
    return {
      ...news,
      id: news.id.toString(),
    };
  }
}
