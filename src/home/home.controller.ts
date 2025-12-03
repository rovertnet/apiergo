import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';
import { HomeService } from './home.service';

@ApiTags('Home')
@Controller()
@UseInterceptors(CacheInterceptor)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Public()
  @Get('home')
  getHomeData(@Query('lang') lang: string = 'fr') {
    return this.homeService.getHomeData(lang);
  }

  @Public()
  @Get('about/entreprise')
  getAboutData() {
    return this.homeService.getAboutData();
  }

  @Public()
  @Get('contact')
  getContactData() {
    return this.homeService.getContactData();
  }
}
