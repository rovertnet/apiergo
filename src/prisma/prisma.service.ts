import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Prisma connection error:', error);
      // Continuer quand même car la connexion lazy peut fonctionner
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
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
