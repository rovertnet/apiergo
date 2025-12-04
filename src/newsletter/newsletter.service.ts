import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsletterDto: CreateNewsletterDto) {
    const existingSubscriber = await this.prisma.newsletter.findFirst({
      where: { email: createNewsletterDto.email },
    });

    if (existingSubscriber) {
      throw new ConflictException('Cet email est déjà inscrit');
    }

    const subscriber = await this.prisma.newsletter.create({
      data: createNewsletterDto,
    });

    return this.transformSubscriber(subscriber);
  }

  async findAll() {
    const subscribers = await this.prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return subscribers.map((subscriber) => this.transformSubscriber(subscriber));
  }

  async findOne(id: number) {
    const subscriber = await this.prisma.newsletter.findUnique({
      where: { id: BigInt(id) },
    });

    if (!subscriber) {
      throw new NotFoundException(`Abonné #${id} non trouvé`);
    }

    return this.transformSubscriber(subscriber);
  }

  async update(id: number, updateNewsletterDto: UpdateNewsletterDto) {
    const subscriber = await this.prisma.newsletter.findUnique({
      where: { id: BigInt(id) },
    });

    if (!subscriber) {
      throw new NotFoundException(`Abonné #${id} non trouvé`);
    }

    if (updateNewsletterDto.email && updateNewsletterDto.email !== subscriber.email) {
      const existingSubscriber = await this.prisma.newsletter.findFirst({
        where: { email: updateNewsletterDto.email },
      });

      if (existingSubscriber) {
        throw new ConflictException('Cet email est déjà inscrit');
      }
    }

    const updatedSubscriber = await this.prisma.newsletter.update({
      where: { id: BigInt(id) },
      data: updateNewsletterDto,
    });

    return this.transformSubscriber(updatedSubscriber);
  }

  async remove(id: number) {
    const subscriber = await this.prisma.newsletter.findUnique({
      where: { id: BigInt(id) },
    });

    if (!subscriber) {
      throw new NotFoundException(`Abonné #${id} non trouvé`);
    }

    await this.prisma.newsletter.delete({
      where: { id: BigInt(id) },
    });

    return { message: 'Abonné supprimé avec succès' };
  }

  private transformSubscriber(subscriber: any) {
    return {
      ...subscriber,
      id: subscriber.id.toString(),
    };
  }
}
