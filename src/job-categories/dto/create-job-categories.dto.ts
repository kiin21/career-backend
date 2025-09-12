export class CreateJobCategoriesDto {
  name: string;
  description?: string | null;
  // Don't forget to use the class-validator decorators in the DTO properties.
}
