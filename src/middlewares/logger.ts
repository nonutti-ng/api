import logger from '../utils/logger';

export const customLogger = (message: string, ...rest: string[]) => {
    logger.info(message, ...rest);
};
