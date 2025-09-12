import { ApiProperty } from '@nestjs/swagger';
import { Companies } from '../../companies/domain/companies';

export class ListJobsResponse {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  location?: string | null;

  @ApiProperty({ type: String })
  employment_type?: string | null;

  @ApiProperty({ type: String })
  experience_level?: string | null;

  @ApiProperty({ type: Date })
  deadline?: Date | null;

  @ApiProperty({ type: Boolean })
  is_active?: boolean;

  @ApiProperty({ type: Companies })
  company: Companies;

  @ApiProperty()
  created_at: Date;
}
