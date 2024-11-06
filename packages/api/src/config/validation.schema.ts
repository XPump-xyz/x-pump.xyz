import * as Joi from 'joi';

export const validationSchema = Joi.object({
  ENCRYPTION_MASTER_KEY: Joi.string().required().min(32),
  // Add other environment variables validation here
});
