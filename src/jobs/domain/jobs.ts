import { ApiProperty } from '@nestjs/swagger';
import { Companies } from '../../companies/domain/companies';
import { Locations } from '../../locations/domain/locations';
import { JobCategories } from '../../job-categories/domain/job-categories';

export class Jobs {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description?: string | null;

  @ApiProperty({ type: String })
  requirements?: string | null;

  @ApiProperty({ type: String })
  location?: string | null;

  @ApiProperty({ type: String })
  employment_type?: string | null;

  @ApiProperty({ type: String })
  experience_level?: string | null;

  @ApiProperty({ type: Number })
  salary_min?: number | null;

  @ApiProperty({ type: Number })
  salary_max?: number | null;

  @ApiProperty({ type: String })
  salary_currency?: string;

  @ApiProperty({ type: String })
  application_method?: string | null;

  @ApiProperty({ type: String })
  application_url?: string | null;

  @ApiProperty({ type: String })
  application_email?: string | null;

  @ApiProperty({ type: Number })
  apply_count?: number;

  @ApiProperty({ type: Date })
  deadline?: Date | null;

  @ApiProperty({ type: Boolean })
  is_active?: boolean;

  @ApiProperty({ type: Companies })
  company: Companies;

  @ApiProperty({ type: JobCategories })
  category: JobCategories;

  @ApiProperty({ type: Locations })
  location_ref: Locations;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
