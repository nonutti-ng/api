import { Hono } from 'hono';
import { useAuth } from '../middlewares/auth.js';
import { AppContext } from '../types/honoTypes.js';

export function createRouter(require_auth: boolean = false) {
    let app = new Hono<AppContext>();
    if (require_auth) {
        app.use(useAuth);
    }

    return app;
}
