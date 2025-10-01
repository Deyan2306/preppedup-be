import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const newUser: User = {
      id: uuidv4(),
      ...userDto,
      password: hashedPassword,
    };

    this.users.push(newUser);

    const { password, ...rest } = newUser;
    return rest;
  }

  findAll(): UserResponseDto[] {
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: string): UserResponseDto | undefined {
    const user = this.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...rest } = user;
    return rest;
  }
}
