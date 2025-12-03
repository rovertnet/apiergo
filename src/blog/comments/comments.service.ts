import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const post = await this.prisma.postBlog.findUnique({
      where: { id: BigInt(createCommentDto.postBlogId) },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException(`Article non trouvé`);
    }

    const comment = await this.prisma.postComment.create({
      data: {
        ...createCommentDto,
        postBlogId: BigInt(createCommentDto.postBlogId),
        status: 0, // Pending by default
      },
    });

    return {
      ...comment,
      id: comment.id.toString(),
      postBlogId: comment.postBlogId.toString(),
    };
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.postComment.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.postComment.count({ where: { deletedAt: null } }),
    ]);

    return {
      data: comments.map((comment) => ({
        ...comment,
        id: comment.id.toString(),
        postBlogId: comment.postBlogId.toString(),
      })),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async approve(id: number) {
    const comment = await this.prisma.postComment.update({
      where: { id: BigInt(id) },
      data: { status: 1 },
    });

    return {
      ...comment,
      id: comment.id.toString(),
      postBlogId: comment.postBlogId.toString(),
    };
  }

  async remove(id: number) {
    await this.prisma.postComment.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Commentaire supprimé' };
  }
}
