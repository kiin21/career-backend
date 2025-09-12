import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobsIndexes1757777148908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pg_trgm extension for trigram indexes
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // Foreign key indexes (if not already exist)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_category_id ON jobs(category_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_location_id ON jobs(location_id);`,
    );

    // Text search indexes (HIGH PRIORITY for performance)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON jobs USING gin(title gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_description_trgm ON jobs USING gin(description gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON companies USING gin(name gin_trgm_ops);`,
    );

    // Full-text search index (ADVANCED - for tsvector queries)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_fulltext_search ON jobs USING gin(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '')));`,
    );

    // Default sorting index
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_created_at_desc ON jobs(created_at DESC);`,
    );

    // Filter indexes (MEDIUM PRIORITY)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_salary_range ON jobs(salary_min, salary_max);`,
    );

    // Composite indexes for common query patterns
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_location_created_at ON jobs(location, created_at DESC);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_jobs_company_created_at ON jobs(company_id, created_at DESC);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes in reverse order
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_jobs_company_created_at;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_jobs_location_created_at;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_salary_range;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_location;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_created_at_desc;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_companies_name_trgm;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_description_trgm;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_title_trgm;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_fulltext_search;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_location_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_category_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_jobs_company_id;`);

    // Note: We don't drop pg_trgm extension as other parts of the app might use it
  }
}
