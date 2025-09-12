import { ApiProperty } from '@nestjs/swagger';

export class JobSkills {
  @ApiProperty({ type: String })
  id: number | string;

  @ApiProperty({ type: String })
  skill_name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
