import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { LocalAuthGuard } from './guards/localauth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {}
}
