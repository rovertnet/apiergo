import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('admin')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('refresh')
  async refresh(@CurrentUser() user: any) {
    return this.authService.refreshToken(user.id);
  }

  @Post('logout')
  async logout() {
    // For JWT, logout is handled client-side by removing the token
    return { message: 'Déconnexion réussie' };
  }
}
