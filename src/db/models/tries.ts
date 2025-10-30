import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../schema';
import { eq, and } from 'drizzle-orm';
import Entries from './entries';

export default class Tries {
    db: MySql2Database<typeof schema>;
    entries: Entries;

    constructor(db: MySql2Database<typeof schema>) {
        this.db = db;
        this.entries = new Entries(db);
    }

    create(data: typeof schema.tries.$inferInsert) {
        return this.db.insert(schema.tries).values(data);
    }

    getByYearAndUser(year: string, uid: string) {
        return this.db
            .select()
            .from(schema.tries)
            .where(
                and(eq(schema.tries.year, year), eq(schema.tries.userId, uid)),
            )
            .limit(1);
    }

    setState(tryId: string, state: 'in' | 'out') {
        return this.db
            .update(schema.tries)
            .set({ state })
            .where(eq(schema.tries.tryId, tryId));
    }

    async failTry(tryId: string) {
        return this.db
            .update(schema.tries)
            .set({ state: 'out' })
            .where(eq(schema.tries.tryId, tryId));
    }
}
