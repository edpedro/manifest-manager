import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ReqUserDto } from '../dto/req-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  create(@Req() req: ReqUserDto) {
    return this.authService.login(req.user);
  }
}
