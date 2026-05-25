import type { ApiErrorShape } from '../models';

export const getErrorMessage = (errorData: ApiErrorShape, fallback: string) => {
  if (errorData.error) return errorData.error;
  if (errorData.message) return errorData.message;
  if (errorData.detail) return errorData.detail;

  if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors.join(' ');
  }

  if (errorData.errors && !Array.isArray(errorData.errors)) {
    const validationMessages = Object.values(errorData.errors).flat();
    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }
  }

  return errorData.title || fallback;
};
