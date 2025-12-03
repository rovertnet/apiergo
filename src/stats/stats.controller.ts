import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // Admin Dashboard Stats
  @Get('admin/dashboard')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  // Admin Page Views Stats
  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  getPageViewsStats() {
    return this.statsService.getPageViewsStats();
  }

  // Public Tracking Endpoint (called by frontend)
  @Public()
  @Post('stats/track')
  trackPageView(@Body('url') url: string, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.statsService.trackPageView(url, ip, userAgent);
  }
}
