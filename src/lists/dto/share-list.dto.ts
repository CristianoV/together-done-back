import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareNewList {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
}