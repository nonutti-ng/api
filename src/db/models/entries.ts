import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../schema';
import { eq, and, inArray, gt } from 'drizzle-orm';

export default class Entries {
    db: MySql2Database<typeof schema>;

    constructor(db: MySql2Database<typeof schema>) {
        this.db = db;
    }

    addEntryToTry(data: typeof schema.entries.$inferInsert) {
        return this.db.insert(schema.entries).values(data);
    }

    getEntriesByTryId(tryId: string, userId: string) {
        return this.db
            .select()
            .from(schema.entries)
            .where(
                and(
                    eq(schema.entries.tryId, tryId),
                    eq(schema.entries.userId, userId),
                ),
            );
    }

    getEntryById(entryId: string, userId: string) {
        return this.db
            .select()
            .from(schema.entries)
            .where(
                and(
                    eq(schema.entries.entryId, entryId),
                    eq(schema.entries.userId, userId),
                ),
            );
    }

    getEntriesByTryIdAndDate(authUserId: string, tryId: string, date: Date) {
        return this.db
            .select()
            .from(schema.entries)
            .where(
                and(
                    eq(schema.entries.userId, authUserId),
                    eq(schema.entries.tryId, tryId),
                    eq(schema.entries.date, date),
                ),
            );
    }

    getEntriesByTryIds(tryIds: string[]) {
        return this.db
            .select()
            .from(schema.entries)
            .where(inArray(schema.entries.tryId, tryIds));
    }

    failEntry(entryId: string) {
        return this.db
            .update(schema.entries)
            .set({ status: 'out' })
            .where(eq(schema.entries.entryId, entryId));
    }

    deleteAllEntriesAfterDate(userId: string, date: Date) {
        return this.db
            .delete(schema.entries)
            .where(
                and(
                    eq(schema.entries.userId, userId),
                    gt(schema.entries.date, date),
                ),
            );
    }
}
