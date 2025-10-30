export const APIErrors = {
    auth: {
        internalError: {
            code: 'A1000',
            message:
                'Could not authenticate you due to an internal error. Please try again later.',
        },

        noSession: {
            code: 'A1001',
            message:
                'Login is required to access this resource. Please log in and try again.',
        },
    },

    users: {
        alreadyOnboarded: {
            code: 'U1000',
            message: 'User has already completed the onboarding process.',
        },
    },

    tries: {
        invalidDate: {
            code: 'T1000',
            message: 'The provided date is invalid (cannot be in the future).',
        },
        entryAlreadyExists: {
            code: 'T1001',
            message:
                'An entry for the specified date already exists for this try.',
        },
        noTryForYear: {
            code: 'T1002',
            message: 'No try found for the current year for this user.',
        },
        entryNotFoundForDate: {
            code: 'T1003',
            message: 'No entry found for the specified date for this try.',
        },

        tryNotFound: {
            code: 'T1004',
            message: 'The specified try could not be found.',
        },
        entryMissing: {
            code: 'T1005',
            message: 'The specified entry could not be found.',
        },
    },

    general: {
        notFound: {
            code: 'G1000',
            message:
                'The requested resource could not be found. Double-check the URL and try again.',
        },

        internalError: {
            code: 'G1001',
            message: 'An internal error occurred. Please try again later.',
        },

        validationError: {
            code: 'G1002',
            message:
                'The request data is invalid. Check provided errors and try again.',
        },
    },
};
