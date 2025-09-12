import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class locationsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
