import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, Workout } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserResponseDto } from './dto/user-response.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';
import { UpdateSbdDto } from './dto/update-sbd.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const newUser: User = {
      id: uuidv4(),
      ...userDto,
      password: hashedPassword,
      squatWorkouts: [],
      benchWorkouts: [],
      deadliftWorkouts: [],
    };

    this.users.push(newUser);

    const { password, ...rest } = newUser;
    return rest;
  }

  findAll(): UserResponseDto[] {
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: string): UserResponseDto {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user;
    return rest;
  }

  updateSbd(userId: string, sbdDto: UpdateSbdDto): UserResponseDto {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    user.squat = sbdDto.squat;
    user.bench = sbdDto.bench;
    user.deadlift = sbdDto.deadlift;

    const { password, ...rest } = user;
    return rest;
  }

  addWorkout(
    userId: string,
    exercise: 'squat' | 'bench' | 'deadlift',
    workoutDto: AddWorkoutDto,
  ) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const workout: Workout = {
      date: new Date().toISOString(),
      sets: workoutDto.sets,
    };

    const workoutArray =
      exercise === 'squat'
        ? user.squatWorkouts
        : exercise === 'bench'
          ? user.benchWorkouts
          : user.deadliftWorkouts;

    workoutArray.push(workout);
    if (workoutArray.length > 3) workoutArray.shift();
  }
}
