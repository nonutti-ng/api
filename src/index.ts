import { Hono } from 'hono';
import { auth } from './utils/auth';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { env } from './utils/env';
import logger from './utils/logger';
import { logger as honoLogger } from 'hono/logger';
import { AppContext } from './types/honoTypes';
import { apiMainRouter } from './routes';
import { ID } from 'id';
import Database from './db';
import { customLogger } from './middlewares/logger';
const app = new Hono<AppContext>();
const db = new Database();
const idGen = new ID({
    username: env!.ID_GEN_USERNAME,
    token: env!.ID_GEN_PASSWORD,
});

logger.info(`🚀 Starting server in ${env!.NODE_ENV} mode on port ${env!.PORT}`);
logger.info('Initializing middleware...');

app.use(honoLogger(customLogger));
app.use((c, next) => {
    c.set('db', db);
    c.set('auth', auth);
    c.set('idGen', idGen);
    return next();
});

app.use(
    '*',
    cors({
        origin: env!.FRONTEND_URL, // replace with your origin
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
    }),
);

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
    logger.info(`Handling auth request: ${c.req.method} ${c.req.url}`);
    return auth.handler(c.req.raw);
});

app.route('/', apiMainRouter);

logger.info('Starting server...');
serve(
    {
        fetch: app.fetch,
        port: env!.PORT,
    },
    () => {
        logger.success(
            `✅ Server is running at http://localhost:${env!.PORT}/`,
        );
    },
);
