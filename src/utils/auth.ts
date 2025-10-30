import { betterAuth, env } from 'better-auth';
import { rawDb } from '../db/index.js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as authSchema from '../db/schema.js';

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    url: env.FRONTEND_URL,
    trustedOrigins: [env.FRONTEND_URL!],
    database: drizzleAdapter(rawDb, {
        provider: 'mysql',
        schema: {
            ...authSchema,
        },
    }),
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: true,
        },
    },
    socialProviders: {
        discord: {
            clientId: env.DISCORD_CLIENT_ID!,
            clientSecret: env.DISCORD_CLIENT_SECRET!,
            scope: ['identify', 'email', 'guilds.join'],
        },
        reddit: {
            clientId: env.REDDIT_CLIENT_ID!,
            clientSecret: env.REDDIT_CLIENT_SECRET!,
            scope: ['identity', 'flair', 'mysubreddits'],
        },
    },
});
