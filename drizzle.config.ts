import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

const localEnv = dotenv.config({ path: '.env.local' });

if (localEnv.error) {
    dotenv.config({ path: '.env' });
}

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: isProduction
    ? process.env.POSTGRES_PRODUCTION_URL!
    : process.env.POSTGRES_URL!,
  },
});
