import { Workout } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  nationality: string;
  squat: number;
  bench: number;
  deadlift: number;
  squatWorkouts: Workout[];
  benchWorkouts: Workout[];
  deadliftWorkouts: Workout[];
}
