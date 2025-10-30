import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../schema.js';
import { eq } from 'drizzle-orm';

export default class User {
    db: MySql2Database<typeof schema>;

    constructor(db: MySql2Database<typeof schema>) {
        this.db = db;
    }

    async onboard(
        uid: string,
        data: typeof schema.userOnboarding.$inferInsert,
    ) {
        await this.db
            .update(schema.user)
            .set({ hasCompletedOnboarding: true })
            .where(eq(schema.user.id, uid));

        return this.db.insert(schema.userOnboarding).values(data);
    }

    getUserWithExtraData(uid: string) {
        return this.db
            .select()
            .from(schema.user)
            .where(eq(schema.user.id, uid))
            .limit(1);
    }

    hasCompletedOnboarding(uid: string) {
        return this.db
            .select({
                hasCompletedOnboarding: schema.user.hasCompletedOnboarding,
            })
            .from(schema.user)
            .where(eq(schema.user.id, uid))
            .limit(1);
    }
}
