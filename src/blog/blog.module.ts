import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    BlogController,
    CategoriesController,
    CommentsController,
  ],
  providers: [
    BlogService,
    CategoriesService,
    CommentsService,
  ],
  exports: [BlogService],
})
export class BlogModule {}
