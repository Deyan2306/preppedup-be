import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'ironwolf' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'ironwolf@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'supersecure123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Bulgaria' })
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female'] })
  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({ example: 82 })
  @IsNumber()
  @Min(0)
  bodyWeight: number;

  @ApiProperty({ example: 160 })
  @IsNumber()
  @Min(0)
  squat: number;

  @ApiProperty({ example: 105 })
  @IsNumber()
  @Min(0)
  bench: number;

  @ApiProperty({ example: 190 })
  @IsNumber()
  @Min(0)
  deadlift: number;

  @ApiProperty({
    example: 'basic',
    enum: ['basic', 'pro', 'max'],
    required: false,
  })
  @IsOptional()
  @IsIn(['basic', 'pro', 'max'])
  membershipPlan?: 'basic' | 'pro' | 'max';
}
