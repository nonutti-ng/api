import Database from '../db/index.js';
import type { auth as authClient } from '../utils/auth.js';
import type { Session, User } from 'better-auth';

export interface AppContext {
    Variables: {
        db: Database;
        auth: typeof authClient;
        session?: Session;
        user?: User;
    };
}
