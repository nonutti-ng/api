import { validateJson } from '../../middlewares/validation';
import { UsersOnboardingDoneRequest } from '../../schemas/users';
import { createRouter } from '../../utils';
import { APIErrors } from '../../utils/apiErrors';
import { createRedditClient } from '../../utils/redditApiClient';

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
        const id = c.get('idGen');
        const uuid = (await id.generateUUID()).id;

        const onboardObj = await db.users.onboard(user!.id, {
            id: uuid,
            ageGroup,
            gender,
            hasDoneState,
            whyDoing,
        });

        // Create try for this year as well
        const tryId = (await id.generateUUID()).id;
        const year = new Date().getFullYear().toString();
        await db.tries.create({
            tryId,
            userId: user!.id,
            year,
            state: 'in',
        });

        return c.json(
            {
                statsStartId: id,
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
