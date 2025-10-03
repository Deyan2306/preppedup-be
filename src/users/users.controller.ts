import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':id/workouts/:exercise')
  addWorkout(
    @Param('id') id: string,
    @Param('exercise') exercise: 'squat' | 'bench' | 'deadlift',
    @Body() workoutDto: AddWorkoutDto,
  ) {
    this.usersService.addWorkout(id, exercise, workoutDto);
    return { message: 'Workout added successfully' };
  }

  @Patch(':id/sbd')
  updateSbd(@Param('id') id: string, @Body() sbdDto: UpdateSbdDto) {
    return this.usersService.updateSbd(id, sbdDto);
  }
}
