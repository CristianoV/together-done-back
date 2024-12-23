import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  list_name: string;

  @ApiProperty()
  @IsBoolean()
  is_favorite: boolean;

  @ApiProperty()
  @IsNumber()
  owner_id: number;
}
