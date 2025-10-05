import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from 'src/db/schema/users.schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE } from 'src/db/drizzle.module';
import * as schema from 'src/db/schema/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _pw, ...rest } = user;

    return this.jwtService.sign(user);
  }
}
