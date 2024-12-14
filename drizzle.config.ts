import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

const localEnv = dotenv.config({ path: '.env.local' });

if (localEnv.error) {
    dotenv.config({ path: '.env' });
}

const isProduction = process.env.NODE_ENV === 'production';

console.log("NODE_ENV is set to production: ", isProduction);
console.log("The node env is set to:", process.env.NODE_ENV);

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
