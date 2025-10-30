import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../schema.js';
import { eq, and } from 'drizzle-orm';

export default class Accounts {
    db: MySql2Database<typeof schema>;

    constructor(db: MySql2Database<typeof schema>) {
        this.db = db;
    }

    getByUserIdAndProvider(userId: string, providerId: string) {
        return this.db
            .select()
            .from(schema.account)
            .where(
                and(
                    eq(schema.account.userId, userId),
                    eq(schema.account.providerId, providerId),
                ),
            )
            .limit(1);
    }

    async updateTokens(
        accountId: string,
        tokens: {
            accessToken: string;
            refreshToken?: string;
            accessTokenExpiresAt: Date;
            refreshTokenExpiresAt?: Date;
        },
    ) {
        return this.db
            .update(schema.account)
            .set({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                accessTokenExpiresAt: tokens.accessTokenExpiresAt,
                refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
            })
            .where(eq(schema.account.id, accountId));
    }
}
