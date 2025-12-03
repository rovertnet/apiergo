import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Public: Post a comment
  @Public()
  @Post('actualites/blog/comment')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  // Admin: List comments
  @Get('admin/comments')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commentsService.findAll(Number(page), Number(limit));
  }

  // Admin: Approve comment
  @Put('admin/comments/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.approve(id);
  }

  // Admin: Delete comment
  @Delete('admin/comments/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
