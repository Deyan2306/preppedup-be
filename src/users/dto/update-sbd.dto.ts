import { IsNumber, Min } from 'class-validator';

export class UpdateSbdDto {
  @IsNumber() @Min(0) squat: number;
  @IsNumber() @Min(0) bench: number;
  @IsNumber() @Min(0) deadlift: number;
}
