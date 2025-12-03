import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Expose Prisma Client
  get client() {
    return this.prisma;
  }

  // Direct access to models
  get user() {
    return this.prisma.user;
  }

  get userRole() {
    return this.prisma.userRole;
  }

  get postBlog() {
    return this.prisma.postBlog;
  }

  get postCategoryBlog() {
    return this.prisma.postCategoryBlog;
  }

  get postComment() {
    return this.prisma.postComment;
  }

  get event() {
    return this.prisma.event;
  }

  get ergoNews() {
    return this.prisma.ergoNews;
  }

  get teamRole() {
    return this.prisma.teamRole;
  }

  get ourTeam() {
    return this.prisma.ourTeam;
  }

  get ourWork() {
    return this.prisma.ourWork;
  }

  get partner() {
    return this.prisma.partner;
  }

  get newsletter() {
    return this.prisma.newsletter;
  }

  get pageView() {
    return this.prisma.pageView;
  }

  /**
   * Helper method to exclude soft-deleted records
   */
  excludeDeleted<T extends { deletedAt?: Date | null }>(records: T[]): T[] {
    return records.filter((record) => !record.deletedAt);
  }

  /**
   * Soft delete helper
   */
  async softDelete(model: any, id: number | bigint) {
    return model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
