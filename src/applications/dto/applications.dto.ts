import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
