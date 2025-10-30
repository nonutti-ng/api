import z from 'zod';

export const UsersOnboardingDoneRequest = z.object({
    ageGroup: z.enum(['18_24', '25_34', '35_44', '45_plus']),
    gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say']),
    hasDoneState: z.enum([
        'first_time',
        'participated_before',
        'completed_before',
    ]),
    whyDoing: z.string().max(500).optional(),
});
