import * as Joi from 'joi';

export interface EnvironmentConfig {
  // Database
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
}

export const envValidationSchema = Joi.object<EnvironmentConfig>({
  // Database
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().optional().default('7d'),
});
