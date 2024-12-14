import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

const localEnv = dotenv.config({ path: '.env.local' });

if (localEnv.error) {
    dotenv.config({ path: '.env' });
}

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
