import { z } from 'zod';

export const LogDailyTryRequest = z.object({
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        })
        .optional(),
    status: z.enum(['in', 'out']),
});
