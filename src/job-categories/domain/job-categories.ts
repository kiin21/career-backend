import { ApiProperty } from '@nestjs/swagger';

export class JobCategories {
  @ApiProperty({ type: String })
  id: number | string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, nullable: true })
  description: string | null;
}
