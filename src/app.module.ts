import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CacheModule } from './cache/cache.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ErgoNewsModule } from './ergo-news/ergo-news.module';
import { EventsModule } from './events/events.module';
import { HomeModule } from './home/home.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { PartnersModule } from './partners/partners.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatsModule } from './stats/stats.module';
import { TeamModule } from './team/team.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { WorksModule } from './works/works.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule,
    UploadModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    BlogModule,
    EventsModule,
    ErgoNewsModule,
    TeamModule,
    PartnersModule,
    WorksModule,
    NewsletterModule,
    HomeModule,
    StatsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
