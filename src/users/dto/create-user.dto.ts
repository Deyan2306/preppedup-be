import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  nationality: string;

  @IsNumber()
  @Min(0)
  squat: number;

  @IsNumber()
  @Min(0)
  bench: number;

  @IsNumber()
  @Min(0)
  deadlift: number;
}
