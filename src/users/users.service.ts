import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Workout } from './entities/user.entity';
import { DRIZZLE } from 'src/db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema/schema';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import { UpdateSbdDto } from './dto/update-sbd.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';

@Injectable()
export class UsersService {
  // in memory workouts - move them to mongo
  private workouts: Record<
    string,
    { squat: Workout[]; bench: Workout[]; deadlift: Workout[] }
  > = {};

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private mapUserToResponse(user: any): UserResponseDto {
    const { password, ...rest } = user;
    return {
      ...rest,
      squatWorkouts: this.workouts[rest.id]?.squat || [],
      benchWorkouts: this.workouts[rest.id]?.bench || [],
      deadliftWorkouts: this.workouts[rest.id]?.deadlift || [],
    };
  }

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const userId = uuidv4();

    await this.db.insert(schema.users).values({
      id: userId,
      username: userDto.username,
      name: userDto.name,
      surname: userDto.surname,
      email: userDto.email,
      password: userDto.password,
      nationality: userDto.nationality,
      squat: userDto.squat,
      bench: userDto.bench,
      deadlift: userDto.deadlift,
      membershipPlan: 'basic',
    });

    this.workouts[userId] = { squat: [], bench: [], deadlift: [] };

    return this.findOne(userId);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const allUsers = await this.db.select().from(schema.users);
    return allUsers.map((u) => this.mapUserToResponse(u));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapUserToResponse(user);
  }

  async updateSbd(
    userId: string,
    sbdDto: UpdateSbdDto,
  ): Promise<UserResponseDto> {
    const [existing] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.db
      .update(schema.users)
      .set({
        squat: sbdDto.squat,
        bench: sbdDto.bench,
        deadlift: sbdDto.deadlift,
      })
      .where(eq(schema.users.id, userId));

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
