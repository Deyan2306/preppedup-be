import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';
import { UpdateSbdDto } from './dto/update-sbd.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AllowAnonymous()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('workouts/:exercise')
  async addWorkout(@Request() req, @Body() workoutDto: AddWorkoutDto) {
    const userId = req.user.sub;
    const exercise = req.params.exercise as 'squat' | 'bench' | 'deadlift';
    return this.usersService.addWorkout(userId, exercise, workoutDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sbd')
  async updateSbd(@Request() req, @Body() sbdDto: UpdateSbdDto) {
    const userId = req.user.sub;
    return this.usersService.updateSbd(userId, sbdDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
