import { z } from "zod";

export const stringValidation = (value: string) => {
  return z.string({
    invalid_type_error: `${value} must a string`,
    required_error: `${value} is required`,
  });
};
