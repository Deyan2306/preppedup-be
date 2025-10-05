import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Post('login')
  async login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.validateUser(authPayload);
  }
}
