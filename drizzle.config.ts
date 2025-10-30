import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './src/utils/env';

if (!env) {
    throw new Error(
        'Fatal: Could not initialize drizzle config due to invalid env',
    );
}

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: env.DATABASE_URL,
        port: env.DATABASE_PORT,
    },
});
