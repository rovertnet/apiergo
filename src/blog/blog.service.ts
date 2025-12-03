import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const existingPost = await this.prisma.postBlog.findUnique({
      where: { slug: createPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Ce slug est déjà utilisé');
    }

    const post = await this.prisma.postBlog.create({
      data: {
        ...createPostDto,
        title: createPostDto.title as any,
        description: createPostDto.description as any,
        postText: createPostDto.postText as any,
        createdBy: userId,
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return this.transformPost(post);
  }

  async findAll(page = 1, limit = 10, lang = 'fr') {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.postBlog.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.postBlog.count({ where: { deletedAt: null } }),
    ]);

    return {
      data: posts.map((post) => this.transformPost(post)),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string) {
    const post = await this.prisma.postBlog.findUnique({
      where: { slug },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        comments: {
          where: { status: 1, deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException(`Article non trouvé`);
    }

    return this.transformPost(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    // Check if post exists
    const post = await this.prisma.postBlog.findUnique({
      where: { id: BigInt(id) },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException(`Article #${id} non trouvé`);
    }

    // Check slug uniqueness if changed
    if (updatePostDto.slug && updatePostDto.slug !== post.slug) {
      const existingPost = await this.prisma.postBlog.findUnique({
        where: { slug: updatePostDto.slug },
      });

      if (existingPost) {
        throw new ConflictException('Ce slug est déjà utilisé');
      }
    }

    const updatedPost = await this.prisma.postBlog.update({
      where: { id: BigInt(id) },
      data: {
        ...updatePostDto,
        title: updatePostDto.title as any,
        description: updatePostDto.description as any,
        postText: updatePostDto.postText as any,
        updatedBy: userId,
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return this.transformPost(updatedPost);
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.postBlog.findUnique({
      where: { id: BigInt(id) },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException(`Article #${id} non trouvé`);
    }

    await this.prisma.postBlog.update({
      where: { id: BigInt(id) },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return { message: 'Article supprimé avec succès' };
  }

  // Helper to handle BigInt serialization and JSON fields
  private transformPost(post: any) {
    return {
      ...post,
      id: post.id.toString(),
      postCategoryId: post.postCategoryId?.toString(), // Handle potential BigInt/Int
      comments: post.comments?.map((comment: any) => ({
        ...comment,
        id: comment.id.toString(),
        postBlogId: comment.postBlogId.toString(),
      })),
    };
  }
}
