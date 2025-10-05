import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthPayloadDto {
  @ApiProperty() @IsString() username: string;
  @ApiProperty() @IsString() password: string;
}
