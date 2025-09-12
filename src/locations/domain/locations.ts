import { ApiProperty } from '@nestjs/swagger';

export class Locations {
  @ApiProperty({
    type: String,
  })
  id: number | string;

  @ApiProperty({ type: String })
  name: string;
}
