import * as Joi from 'joi';

export interface JwtConfig {
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
}

export const jwtConfigValidationSchema = Joi.object<JwtConfig>({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().optional().default('7d'),
});
