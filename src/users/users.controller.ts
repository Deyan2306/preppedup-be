import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';
import { UpdateSbdDto } from './dto/update-sbd.dto';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -------------------- AUTH --------------------

  @AllowAnonymous()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @AllowAnonymous()
  @Post('login')
  async login(@Body() dto: LoginDto, @Session() session: any) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Store userId in the session
    session.userId = user.id;

    return { message: 'Logged in successfully', userId: user.id };
  }

  @Post('logout')
  async logout(@Session() session: any) {
    // Clear userId from session
    session.userId = null;

    return { message: 'Logged out successfully' };
  }

  // -------------------- USER PROFILE --------------------

  @Get('me')
  async getProfile(@Session() session: any) {
    const userId = session.userId;
    if (!userId) throw new UnauthorizedException('Not logged in');

    return this.usersService.findOne(userId);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // -------------------- WORKOUTS --------------------

  @Post(':id/workouts/:exercise')
  async addWorkout(
    @Param('id') id: string,
    @Param('exercise') exercise: 'squat' | 'bench' | 'deadlift',
    @Body() workoutDto: AddWorkoutDto,
  ) {
    return this.usersService.addWorkout(id, exercise, workoutDto);
  }

  // -------------------- SBD --------------------

  @Patch(':id/sbd')
  async updateSbd(@Param('id') id: string, @Body() sbdDto: UpdateSbdDto) {
    return this.usersService.updateSbd(id, sbdDto);
  }
}
