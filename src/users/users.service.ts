import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';
import { UpdateSbdDto } from './dto/update-sbd.dto';
import { users } from 'src/db/schema';
import { db } from 'src/db/drizzle';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Workout } from './entities/user.entity';

@Injectable()
export class UsersService {
  // workouts remain in memory for now
  private workouts: Record<
    string,
    {
      squat: Workout[];
      bench: Workout[];
      deadlift: Workout[];
    }
  > = {};

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      username: userDto.username,
      name: userDto.name,
      surname: userDto.surname,
      email: userDto.email,
      password: hashedPassword,
      nationality: userDto.nationality,
      squat: userDto.squat,
      bench: userDto.bench,
      deadlift: userDto.deadlift,
      membershipPlan: 'basic',
    });

    // initialize empty workouts in memory
    this.workouts[userId] = { squat: [], bench: [], deadlift: [] };

    return this.findOne(userId);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(({ password, ...rest }) => ({
      ...rest,
      squatWorkouts: this.workouts[rest.id]?.squat || [],
      benchWorkouts: this.workouts[rest.id]?.bench || [],
      deadliftWorkouts: this.workouts[rest.id]?.deadlift || [],
    }));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new NotFoundException('User not found');

    const { password, ...rest } = user;
    return {
      ...rest,
      squatWorkouts: this.workouts[id]?.squat || [],
      benchWorkouts: this.workouts[id]?.bench || [],
      deadliftWorkouts: this.workouts[id]?.deadlift || [],
    };
  }

  async updateSbd(
    userId: string,
    sbdDto: UpdateSbdDto,
  ): Promise<UserResponseDto> {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    if (!existing) throw new NotFoundException('User not found');

    await db
      .update(users)
      .set({
        squat: sbdDto.squat,
        bench: sbdDto.bench,
        deadlift: sbdDto.deadlift,
      })
      .where(eq(users.id, userId));

    return this.findOne(userId);
  }

  addWorkout(
    userId: string,
    exercise: 'squat' | 'bench' | 'deadlift',
    workoutDto: AddWorkoutDto,
  ) {
    if (!this.workouts[userId]) {
      this.workouts[userId] = { squat: [], bench: [], deadlift: [] };
    }

    const workout: Workout = {
      date: workoutDto.date ?? new Date().toISOString(),
      sets: workoutDto.sets,
    };

    this.workouts[userId][exercise].push(workout);
    if (this.workouts[userId][exercise].length > 3) {
      this.workouts[userId][exercise].shift();
    }

    return { message: 'Workout added successfully' };
  }
}
