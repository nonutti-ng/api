import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { env } from '../utils/env.js';
import User from './models/user.js';
import * as schema from './schema.js';
import Tries from './models/tries.js';
import Entries from './models/entries.js';
import Accounts from './models/accounts.js';

export const rawDb = drizzle<typeof schema>(env!.DATABASE_URL, {
    schema,
    mode: 'default',
});

export default class Database {
    db: ReturnType<typeof drizzle<typeof schema>>;
    public users: User;
    public tries: Tries;
    public entries: Entries;
    public accounts: Accounts;

    constructor() {
        this.db = rawDb;
        this.users = new User(this.db);
        this.tries = new Tries(this.db);
        this.entries = new Entries(this.db);
        this.accounts = new Accounts(this.db);
    }
}
