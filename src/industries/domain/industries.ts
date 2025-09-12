import { ApiProperty } from '@nestjs/swagger';

export class Industries {
  @ApiProperty({
    type: String,
  })
  id: number | string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
