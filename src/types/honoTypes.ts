import { ID } from 'id';
import Database from '../db/index.js';
import type { auth as authClient } from '../utils/auth.js';
import type { Session, User } from 'better-auth';

export interface AppContext {
    Variables: {
        idGen: ID;
        db: Database;
        auth: typeof authClient;
        session?: Session;
        user?: User;
    };
}
