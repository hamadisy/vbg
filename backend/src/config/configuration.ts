import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  // Base URL of the deployed frontend - used to build absolute case links in
  // SMS notifications (no route to build one server-side otherwise).
  frontendUrl: (process.env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, ''),
  database: {
    storage: process.env.DB_STORAGE ?? './data/vbg-dev.sqlite',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '8h',
  },
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
  passwordResetTokenTtlMinutes: parseInt(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES ?? '30', 10),
  mailProvider: process.env.MAIL_PROVIDER ?? 'stub',
  sms: {
    provider: process.env.SMS_PROVIDER ?? 'stub',
    vonage: {
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
      senderId: process.env.VONAGE_SMS_SENDER_ID ?? 'VBG',
    },
  },
  seedAdmin: {
    username: process.env.SEED_ADMIN_USERNAME ?? 'admin',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'change-me',
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@csvvdh.local',
  },
  seedUser: {
    // Shared placeholder for every non-admin seeded user - bcrypt hashes
    // can't be reversed, so real passwords set via the UI aren't reproducible;
    // rotate each user's password via the Users admin page after seeding.
    password: process.env.SEED_USER_PASSWORD ?? 'ChangeMe123!',
  },
}));
