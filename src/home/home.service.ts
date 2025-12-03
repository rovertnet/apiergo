import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHomeData(lang: string = 'fr') {
    const [posts, events, partners] = await Promise.all([
      this.prisma.postBlog.findMany({
        where: { deletedAt: null, status: 1 },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.findMany({
        where: { status: 1 },
        take: 3,
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.partner.findMany({
        where: { status: 1 },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      posts: posts.map(p => ({ ...p, id: p.id.toString() })),
      events: events.map(e => ({ ...e, id: e.id.toString() })),
      partners: partners.map(p => ({ ...p, id: p.id.toString() })),
    };
  }

  async getAboutData() {
    return {
      message: "À propos de l'entreprise",
      // Add more static or dynamic data as needed
    };
  }

  async getContactData() {
    return {
      email: 'contact@ergo.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de Paris, 75000 Paris',
    };
  }
}
