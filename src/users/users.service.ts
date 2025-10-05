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
import { users, workouts, workoutSets } from 'src/db/schema/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private async mapUserToResponse(user: any): Promise<UserResponseDto> {
    const { password, ...rest } = user;
    const workoutsData = await this.getUserWorkouts(rest.id);
    return {
      ...rest,
      ...workoutsData,
    };
  }

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const userId = uuidv4();

    await this.db.insert(users).values({
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

    return this.findOne(userId);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const allUsers = await this.db.select().from(users);
    return Promise.all(allUsers.map((u) => this.mapUserToResponse(u)));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) throw new NotFoundException('User not found');

    return this.mapUserToResponse(user);
  }

  async updateSbd(
    userId: string,
    sbdDto: UpdateSbdDto,
  ): Promise<UserResponseDto> {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existing) throw new NotFoundException('User not found');

    await this.db
      .update(users)
      .set({
        squat: sbdDto.squat,
        bench: sbdDto.bench,
        deadlift: sbdDto.deadlift,
      })
      .where(eq(users.id, userId));

    return this.findOne(userId);
  }

  async addWorkout(
    userId: string,
    exercise: 'squat' | 'bench' | 'deadlift',
    workoutDto: AddWorkoutDto,
  ) {
    const workoutId = uuidv4();

    await this.db.insert(workouts).values({
      id: workoutId,
      userId,
      exercise,
      date: workoutDto.date ? new Date(workoutDto.date) : new Date(),
    });

    for (const set of workoutDto.sets) {
      await this.db.insert(workoutSets).values({
        id: uuidv4(),
        workoutId,
        weight: set.weight,
        reps: set.reps,
        targetRpe: set.targetRpe,
        actualRpe: set.actualRpe,
      });
    }

    return { message: 'Workout added successfully' };
  }

  private async getUserWorkouts(userId: string) {
    const userWorkouts = await this.db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId));

    const squatWorkouts: Workout[] = [];
    const benchWorkouts: Workout[] = [];
    const deadliftWorkouts: Workout[] = [];

    for (const w of userWorkouts) {
      const sets = await this.db
        .select()
        .from(workoutSets)
        .where(eq(workoutSets.workoutId, w.id));

      const workout: Workout = { date: w.date.toISOString(), sets };

      switch (w.exercise) {
        case 'squat':
          squatWorkouts.push(workout);
          break;
        case 'bench':
          benchWorkouts.push(workout);
          break;
        case 'deadlift':
          deadliftWorkouts.push(workout);
          break;
      }
    }

    return { squatWorkouts, benchWorkouts, deadliftWorkouts };
  }
}
