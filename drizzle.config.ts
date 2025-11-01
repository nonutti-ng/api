import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
        port: process.env.DATABASE_PORT
            ? Number(process.env.DATABASE_PORT)
            : undefined,
    },
});
