import { BadRequestException } from '@nestjs/common';

export interface ValidationErrorDetail {
  field: string;
  code: string;
  message: string;
}

export class CustomValidationException extends BadRequestException {
  public readonly errorDetail: ValidationErrorDetail;

  constructor(field: string, code: string, message: string) {
    super();
    this.errorDetail = {
      field,
      code,
      message,
    };
  }
}
