import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

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

  private transformSubscriber(subscriber: any) {
    return {
      ...subscriber,
      id: subscriber.id.toString(),
    };
  }
}
