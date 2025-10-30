import logger from '../utils/logger.js';

export const customLogger = (message: string, ...rest: string[]) => {
    logger.info(message, ...rest);
};
