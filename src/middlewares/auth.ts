import type { Context, Next } from 'hono';
import type { AppContext } from '../types/honoTypes.js';
import { APIErrors } from '../utils/apiErrors.js';

export async function useAuth(c: Context<AppContext>, next: Next) {
    const authInst = c.get('auth');
    if (!authInst) {
        return c.json(APIErrors.auth.internalError, { status: 500 });
    }

    const session = await authInst.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        return c.json(APIErrors.auth.noSession, { status: 401 });
    }

    c.set('session', session.session);
    c.set('user', session.user);
    await next();
}
