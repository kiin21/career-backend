import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated_at: Date;
}

export abstract class BaseDomain {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;
}
