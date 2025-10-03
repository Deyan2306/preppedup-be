import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';
import { UpdateSbdDto } from './dto/update-sbd.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post(':id/workouts/:exercise')
  async addWorkout(
    @Param('id') id: string,
    @Param('exercise') exercise: 'squat' | 'bench' | 'deadlift',
    @Body() workoutDto: AddWorkoutDto,
  ) {
    // this method returns a simple message
    return await this.usersService.addWorkout(id, exercise, workoutDto);
  }

  @Patch(':id/sbd')
  async updateSbd(@Param('id') id: string, @Body() sbdDto: UpdateSbdDto) {
    return await this.usersService.updateSbd(id, sbdDto);
  }
}
