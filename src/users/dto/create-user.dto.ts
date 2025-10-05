import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty() @IsNotEmpty() username: string;
  @ApiProperty() @IsNotEmpty() name: string;
  @ApiProperty() @IsNotEmpty() surname: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() password: string;
  @ApiProperty() @IsNotEmpty() nationality: string;
  @ApiProperty() @IsNumber() @Min(0) squat: number;
  @ApiProperty() @IsNumber() @Min(0) bench: number;
  @ApiProperty() @IsNumber() @Min(0) deadlift: number;

  @ApiProperty()
  @IsOptional()
  @IsIn(['basic', 'pro', 'max'])
  membershipPlan?: 'basic' | 'pro' | 'max';
}
