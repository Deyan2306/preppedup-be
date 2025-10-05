import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/db/drizzle.module';
import * as schema from 'src/db/schema/schema';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import { UpdateSbdDto } from './dto/update-sbd.dto';
import { AddWorkoutDto } from './dto/add-workout.dto';
import { Workout } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private mapUserToResponse(
    user: any,
    workoutsData?: { [key: string]: Workout[] },
  ): UserResponseDto {
    const { password, ...rest } = user;
    return {
      ...rest,
      squatWorkouts: workoutsData?.squat || [],
      benchWorkouts: workoutsData?.bench || [],
      deadliftWorkouts: workoutsData?.deadlift || [],
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
    const allUsers = await this.db.select().from(schema.users);
    const result: UserResponseDto[] = [];
    for (const u of allUsers) {
      const workouts = await this.getUserWorkouts(u.id);
      result.push(this.mapUserToResponse(u, workouts));
    }
    return result;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    if (!user) throw new NotFoundException('User not found');
    const workouts = await this.getUserWorkouts(id);
    return this.mapUserToResponse(user, workouts);
  }

  async updateSbd(
    userId: string,
    sbdDto: UpdateSbdDto,
  ): Promise<UserResponseDto> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));
    if (!user) throw new NotFoundException('User not found');

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

  async addWorkout(
    userId: string,
    exercise: 'squat' | 'bench' | 'deadlift',
    workoutDto: AddWorkoutDto,
  ) {
    const workoutId = uuidv4();

    await this.db.insert(schema.workouts).values({
      id: workoutId,
      userId,
      exercise,
      date: workoutDto.date ? new Date(workoutDto.date) : new Date(),
    });

    for (const set of workoutDto.sets) {
      await this.db.insert(schema.workoutSets).values({
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
      .from(schema.workouts)
      .where(eq(schema.workouts.userId, userId));

    const squatWorkouts: Workout[] = [];
    const benchWorkouts: Workout[] = [];
    const deadliftWorkouts: Workout[] = [];

    for (const w of userWorkouts) {
      const sets = await this.db
        .select()
        .from(schema.workoutSets)
        .where(eq(schema.workoutSets.workoutId, w.id));
      const workout: Workout = { date: w.date.toISOString(), sets };
      if (w.exercise === 'squat') squatWorkouts.push(workout);
      if (w.exercise === 'bench') benchWorkouts.push(workout);
      if (w.exercise === 'deadlift') deadliftWorkouts.push(workout);
    }

    return {
      squat: squatWorkouts,
      bench: benchWorkouts,
      deadlift: deadliftWorkouts,
    };
  }
}
