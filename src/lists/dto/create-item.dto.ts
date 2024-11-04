import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  item_name: string;

  @ApiProperty()
  @IsBoolean()
  is_completed: boolean;

  @ApiProperty()
  @IsNumber()
  responsible_id: number;
}
