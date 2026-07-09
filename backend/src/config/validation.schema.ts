import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  CORS_ORIGIN: Joi.string().default('*'),

  DB_STORAGE: Joi.string().default('./data/vbg-dev.sqlite'),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('8h'),

  BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  PASSWORD_RESET_TOKEN_TTL_MINUTES: Joi.number().default(30),

  MAIL_PROVIDER: Joi.string().default('stub'),

  SMS_PROVIDER: Joi.string().valid('stub', 'vonage').default('stub'),
  VONAGE_API_KEY: Joi.string().allow('').default(''),
  VONAGE_API_SECRET: Joi.string().allow('').default(''),
  VONAGE_SMS_SENDER_ID: Joi.string().default('VBG'),

  SEED_ADMIN_USERNAME: Joi.string().default('admin'),
  SEED_ADMIN_PASSWORD: Joi.string().default('change-me'),
  SEED_ADMIN_EMAIL: Joi.string().email({ tlds: false }).default('admin@csvvdh.local'),
  SEED_USER_PASSWORD: Joi.string().default('ChangeMe123!'),
});
