import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class companiesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
