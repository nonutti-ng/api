import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    boolean,
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),

    hasCompletedOnboarding: boolean('has_completed_onboarding')
        .default(false)
        .notNull(),

    browserNotificationToken: text('browser_notification_token'),
});

// We store user onboarding in a separate table, without a relation to the user table, to anonymize the data.
export const userOnboarding = mysqlTable('user_onboarding', {
    id: varchar('id', { length: 36 }).primaryKey(),
    ageGroup: varchar('age_group', { length: 10 }).notNull(),
    gender: varchar('gender', { length: 20 }).notNull(),
    hasDoneState: varchar('has_done_state', { length: 30 }).notNull(),
    whyDoing: text('why_doing'),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
});

export const session = mysqlTable('session', {
    id: varchar('id', { length: 36 }).primaryKey(),
    expiresAt: timestamp('expires_at', { fsp: 3 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: varchar('user_id', { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = mysqlTable('account', {
    id: varchar('id', { length: 36 }).primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: varchar('user_id', { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { fsp: 3 }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { fsp: 3 }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const verification = mysqlTable('verification', {
    id: varchar('id', { length: 36 }).primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { fsp: 3 }).notNull(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const tries = mysqlTable('tries', {
    tryId: varchar('try_id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),

    year: varchar('year', { length: 4 }).notNull(),
    state: varchar('state', { length: 3 }).notNull(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 }),
});

export const entries = mysqlTable('entries', {
    entryId: varchar('entry_id', { length: 36 }).primaryKey(),
    tryId: varchar('try_id', { length: 36 })
        .notNull()
        .references(() => tries.tryId, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),

    date: timestamp('date', { fsp: 3 }).notNull(),
    status: varchar('status', { length: 3 }).notNull(),
    createdAt: timestamp('created_at', { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { fsp: 3 }),
});
