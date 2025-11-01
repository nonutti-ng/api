import { validateJson } from '../../middlewares/validation.js';
import { LogDailyTryRequest } from '../../schemas/tries.js';
import { createRouter } from '../../utils/index.js';
import { APIErrors } from '../../utils/apiErrors.js';
import { DateTime } from 'luxon';
const triesRouter = createRouter(true);

triesRouter.post('/me/log', validateJson(LogDailyTryRequest), async (c) => {
    const { status, date } = await c.req.valid('json');

    const db = c.get('db');
    const user = c.get('user');

    // Grab the user's try for the current year
    const year = new Date().getFullYear().toString();
    const userTries = await db.tries.getByYearAndUser(year, user!.id);
    if (!userTries.length) {
        return c.json(APIErrors.tries.noTryForYear, 404);
    }

    const tryId = userTries[0].tryId;
    const dateToUse =
        date !== undefined
            ? DateTime.fromISO(date).toJSDate()
            : DateTime.utc().toJSDate();

    // The date cannot be in the future
    if (dateToUse > DateTime.utc().toJSDate()) {
        return c.json(APIErrors.tries.invalidDate, 400);
    }

    // The date must be within the current year, in november.
    if (
        dateToUse.getFullYear() !== DateTime.utc().toJSDate().getFullYear() ||
        dateToUse.getMonth() !== 10
    ) {
        console.log(dateToUse.getFullYear(), dateToUse.getMonth());
        return c.json(APIErrors.tries.dateNotInRange, 400);
    }

    console.log('date is valid');

    // If it's a date in the past, check if we DONT have an entry already
    if (date) {
        const existingEntries = await db.entries.getEntriesByTryIdAndDate(
            user!.id,
            tryId,
            dateToUse,
        );

        if (existingEntries.length) {
            return c.json(APIErrors.tries.entryAlreadyExists, 400);
        }
    }

    if (status === 'out') {
        // Mark all future entries as 'out' and fail the try
        await db.entries.deleteAllEntriesAfterDate(user!.id, dateToUse);
        await db.tries.failTry(tryId);
    }

    // Generate a UUID for the entry
    const entryId = crypto.randomUUID();

    // Create the entry
    await db.entries.addEntryToTry({
        entryId,
        tryId,
        userId: user!.id,
        date: dateToUse,
        status,
    });

    return c.json({ id: entryId }, 201);
});

triesRouter.get('/me/current', async (c) => {
    const user = c.get('user');
    const db = c.get('db');

    // optional ?year=YYYY, default to current year
    const qYear = c.req.query('year') as string | undefined;
    const year = qYear ?? new Date().getFullYear().toString();

    // Get the user's try for the requested year
    const userTries = await db.tries.getByYearAndUser(year, user!.id);
    if (!userTries.length) {
        return c.json(APIErrors.tries.noTryForYear, 404);
    }

    const currentTry = userTries[0];

    // Retrieve entries for that try
    const entries = await db.entries.getEntriesByTryIds([currentTry.tryId]);

    return c.json({ try: currentTry, entries });
});

triesRouter.post('/me/:id/fail', async (c) => {
    const entryId = c.req.param('id');
    const db = c.get('db');
    const user = c.get('user');

    // Verify that the entry belongs to the user
    const userTries = await db.tries.getByYearAndUser(
        new Date().getFullYear().toString(),
        user!.id,
    );

    if (!userTries.length) {
        return c.json(APIErrors.tries.noTryForYear, 404);
    }

    const tryId = userTries[0].tryId;

    // Mark the try as failed (if not already) and fail the entry for the date
    await db.entries.deleteAllEntriesAfterDate(user!.id, new Date());
    await db.tries.failTry(tryId);

    // Get the entry for the date and fail it
    const entry = await db.entries.getEntryById(entryId, user!.id);
    if (!entry.length) {
        return c.json(APIErrors.tries.entryMissing, 404);
    }

    const entryToFail = entry[0];
    await db.entries.failEntry(entryToFail.entryId);

    return c.json({
        message: 'Entry and try marked as failed successfully',
    });
});

export default triesRouter;
