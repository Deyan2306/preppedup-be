import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from 'src/db/drizzle.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1d' },
    }),
    DrizzleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
