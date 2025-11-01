import { validateJson } from '../../middlewares/validation.js';
import { UsersOnboardingDoneRequest } from '../../schemas/users.js';
import { createRouter } from '../../utils/index.js';
import { APIErrors } from '../../utils/apiErrors.js';
import { createRedditClient } from '../../utils/redditApiClient.js';

const usersRouter = createRouter(true);

usersRouter.get('/me', async (c) => {
    const user = c.get('user');
    const db = c.get('db');
    const userData = await db.users.getUserWithExtraData(user!.id);

    if (!userData.length) {
        return c.json(APIErrors.general.notFound, 404);
    }

    return c.json(userData[0]);
});

usersRouter.post(
    '/onboard',
    validateJson(UsersOnboardingDoneRequest),
    async (c) => {
        const { ageGroup, gender, hasDoneState, whyDoing } = await c.req.valid(
            'json',
        );

        const db = c.get('db');
        const user = c.get('user');

        const hasCompletedOnboarding = await db.users.hasCompletedOnboarding(
            user!.id,
        );

        if (
            hasCompletedOnboarding.length &&
            hasCompletedOnboarding[0].hasCompletedOnboarding
        ) {
            return c.json(APIErrors.users.alreadyOnboarded, 400);
        }

        // Generate a UUID for the onboarding entry
        const uuid = crypto.randomUUID();

        const onboardObj = await db.users.onboard(user!.id, {
            id: uuid,
            ageGroup,
            gender,
            hasDoneState,
            whyDoing,
        });

        // Create try for this year as well
        const tryId = crypto.randomUUID();
        const year = new Date().getFullYear().toString();
        await db.tries.create({
            tryId,
            userId: user!.id,
            year,
            state: 'in',
        });

        return c.json(
            {
                statsStartId: uuid,
                tryId,
            },
            201,
        );
    },
);

usersRouter.get('/me/reddit', async (c) => {
    const user = c.get('user');
    const db = c.get('db');

    // Create a reddit client
    const redditClient = await createRedditClient(user!.id, db);
    const redditMe = await redditClient.getMe();

    return c.json(redditMe);
});

export default usersRouter;
