import { TransformFnParams } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';
import { MaybeType } from '../types/maybe.type';
import { CustomValidationException } from '../exceptions/custom-validation.exception';

/**
 * Creates a JSON transformer function for safely parsing JSON from query parameters
 * @param dtoClass - The DTO class to transform the parsed JSON to
 * @param fieldName - The name of the field for error messages
 * @returns Transform function
 */
export const createJsonTransformer = <T>(dtoClass: new () => T, fieldName: string = 'field') => {
  return (params: TransformFnParams): MaybeType<T> => {
    if (!params.value) return undefined;

    try {
      const parsed = JSON.parse(params.value);
      return plainToInstance(dtoClass, parsed);
    } catch (error) {
      throw new CustomValidationException(fieldName, 'INVALID_JSON_FORMAT', `Invalid JSON format: ${error.message}`);
    }
  };
};
