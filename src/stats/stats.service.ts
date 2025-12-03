import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      postsCount,
      eventsCount,
      usersCount,
      commentsCount,
      partnersCount,
      worksCount,
      newsletterCount,
    ] = await Promise.all([
      this.prisma.postBlog.count({ where: { deletedAt: null } }),
      this.prisma.event.count(),
      this.prisma.user.count(),
      this.prisma.postComment.count({ where: { deletedAt: null } }),
      this.prisma.partner.count(),
      this.prisma.ourWork.count(),
      this.prisma.newsletter.count(),
    ]);

    return {
      posts: postsCount,
      events: eventsCount,
      users: usersCount,
      comments: commentsCount,
      partners: partnersCount,
      works: worksCount,
      subscribers: newsletterCount,
    };
  }

  async trackPageView(url: string, ip?: string, userAgent?: string) {
    return this.prisma.pageView.create({
      data: {
        pageUrl: url,
        ipAddress: ip,
        userAgent: userAgent,
        visitedAt: new Date(),
      },
    });
  }

  async getPageViewsStats() {
    // Simple stats: total views, views per page (top 10)
    const totalViews = await this.prisma.pageView.count();
    
    const topPages = await this.prisma.pageView.groupBy({
      by: ['pageUrl'],
      _count: {
        pageUrl: true,
      },
      orderBy: {
        _count: {
          pageUrl: 'desc',
        },
      },
      take: 10,
    });

    return {
      totalViews,
      topPages: topPages.map(p => ({
        url: p.pageUrl,
        views: p._count.pageUrl,
      })),
    };
  }
}
