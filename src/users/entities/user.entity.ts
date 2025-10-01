export class WorkoutSet {
  weight: number;
  reps: number;
  targetRpe: number;
  actualRpe: number;
}

export class Workout {
  date: string;
  sets: WorkoutSet[];
}

export class User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  nationality: string;
  squat: number;
  bench: number;
  deadlift: number;

  squatWorkouts: Workout[];
  benchWorkouts: Workout[];
  deadliftWorkouts: Workout[];
}
