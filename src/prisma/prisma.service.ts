import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({});
  }

  async onModuleInit() {
    await this.$connect();
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
