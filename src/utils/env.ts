import 'dotenv/config';
import { z } from 'zod';
import logger from './logger';

const envSchema = z.object({
    PORT: z
        .string()
        .transform((val) => parseInt(val, 10))
        .default(3003),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    DATABASE_URL: z.string(),
    DATABASE_PORT: z
        .string()
        .transform((val) => parseInt(val, 10))
        .default(3306),
    BETTER_AUTH_SECRET: z.string(),
    FRONTEND_URL: z.url(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    REDDIT_CLIENT_ID: z.string(),
    REDDIT_CLIENT_SECRET: z.string(),
    ID_GEN_USERNAME: z.string(),
    ID_GEN_PASSWORD: z.string(),
});

let parsedEnv: z.infer<typeof envSchema> | undefined = undefined;
try {
    parsedEnv = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        logger.error('❌ Invalid environment variables:');
        for (const issue of error.issues) {
            logger.error(` - ${issue.path.join('.')} : ${issue.message}`);
        }

        logger.error(
            '[critical] Exiting due to invalid environment variables.',
        );
        process.exit(1);
    }
}

export const env = parsedEnv;
