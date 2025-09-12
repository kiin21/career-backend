import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../api-response';
import { CustomValidationException } from '../exceptions/custom-validation.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      // Check if it's our custom validation exception
      if (exception instanceof CustomValidationException) {
        errorResponse = ApiResponse.validationError(
          'Request validation failed',
          exception.errorDetail,
          'VALIDATION_ERROR',
        );
      } else {
        const exceptionResponse = exception.getResponse();

        // Handle other validation errors (class-validator)
        if (
          typeof exceptionResponse === 'object' &&
          exceptionResponse !== null
        ) {
          const responseObj = exceptionResponse as any;

          if (responseObj.errors) {
            // Class-validator errors - convert to our format
            const firstError = Object.keys(responseObj.errors)[0];
            const firstErrorMessage = responseObj.errors[firstError];

            errorResponse = ApiResponse.validationError(
              'Request validation failed',
              {
                field: firstError,
                code: 'VALIDATION_FAILED',
                message: firstErrorMessage,
              },
              'VALIDATION_ERROR',
            );
          } else {
            // Other HTTP exceptions
            errorResponse = ApiResponse.error(
              responseObj,
              this.getHttpCodeString(status),
            );
          }
        } else {
          // Simple string messages
          errorResponse = ApiResponse.error(
            exception.message,
            this.getHttpCodeString(status),
          );
        }
      }
    } else {
      // Handle unexpected errors
      errorResponse = ApiResponse.error(
        process.env.NODE_ENV === 'development'
          ? (exception as Error).stack
          : null,
        'INTERNAL_SERVER_ERROR',
      );
    }

    response.status(status).json(errorResponse);
  }

  private getHttpCodeString(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'ERROR';
    }
  }
}
