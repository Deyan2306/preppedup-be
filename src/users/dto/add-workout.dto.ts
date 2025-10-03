import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class WorkoutSetDto {
  @IsNumber() @Min(0) weight: number;
  @IsNumber() @Min(1) reps: number;
  @IsNumber() @Min(1) targetRpe: number;
  @IsNumber() @Min(1) actualRpe: number;
}

export class AddWorkoutDto {
  @IsOptional() date?: string;
  @IsArray() sets: WorkoutSetDto[];
}
