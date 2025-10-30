import { zValidator } from '@hono/zod-validator';
import type { Context } from 'hono';
import type { ZodType } from 'zod';
import { APIErrors } from '../utils/apiErrors.js';

/**
 * Middleware to validate requests using Zod schemas.
 * Uses the `zValidator` from Hono to validate the request data. Returns a standardized error response if validation fails.
 *
 * @param target - The target to validate ('json', 'query', 'param', 'header', 'cookie')
 * @param schema - The Zod schema to validate against
 */
export function validateRequest<T>(
    target: 'json' | 'query' | 'param' | 'header' | 'cookie',
    schema: ZodType<T>,
) {
    return zValidator(target, schema, (result, c: Context) => {
        if (!result.success) {
            return c.json(
                {
                    ...APIErrors.general.validationError,
                    description:
                        'Your request does not match the expected schema. Check the details object for more information.',
                    details: result.error.issues.map((issue) => ({
                        message: issue.message,
                        path: issue.path,
                        code: issue.code,
                    })),
                },
                400,
            );
        }
    });
}

/**
 * Convenience function for validating JSON request bodies
 */
export function validateJson<T>(schema: ZodType<T>) {
    return validateRequest('json', schema);
}

/**
 * Convenience function for validating query parameters
 */
export function validateQuery<T>(schema: ZodType<T>) {
    return validateRequest('query', schema);
}

/**
 * Convenience function for validating URL parameters
 */
export function validateParams<T>(schema: ZodType<T>) {
    return validateRequest('param', schema);
}
