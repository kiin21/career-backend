import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JobSkillsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
