import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../types/maybe.type';
import { CustomValidationException } from '../exceptions/custom-validation.exception';

/**
 * Creates a number transformer function for safely parsing numbers from query parameters
 * @param fieldName - The name of the field for error messages
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @returns Transform function
 */
export const createNumberTransformer = (fieldName: string = 'field', min?: number, max?: number) => {
  return (params: TransformFnParams): MaybeType<number> => {
    if (!params.value) return undefined;

    const num = Number(params.value);

    if (isNaN(num)) {
      throw new CustomValidationException(fieldName, 'INVALID_NUMBER', `${fieldName} must be a valid number`);
    }

    if (min !== undefined && num < min) {
      throw new CustomValidationException(
        fieldName,
        'INVALID_VALUE',
        `${fieldName} must be greater than or equal to ${min}`,
      );
    }

    if (max !== undefined && num > max) {
      throw new CustomValidationException(
        fieldName,
        'INVALID_VALUE',
        `${fieldName} must be less than or equal to ${max}`,
      );
    }

    return num;
  };
};
