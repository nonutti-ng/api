import chalk from 'chalk';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';

interface LoggerOptions {
    includeTimestamp?: boolean;
    includeLevel?: boolean;
    dateFormat?: 'iso' | 'locale' | 'time';
}

class Logger {
    private options: Required<LoggerOptions>;

    constructor(options: LoggerOptions = {}) {
        this.options = {
            includeTimestamp: options.includeTimestamp ?? true,
            includeLevel: options.includeLevel ?? true,
            dateFormat: options.dateFormat ?? 'locale',
        };
    }

    private formatTimestamp(): string {
        const now = new Date();
        switch (this.options.dateFormat) {
            case 'iso':
                return now.toISOString();
            case 'time':
                return now.toLocaleTimeString();
            case 'locale':
            default:
                return now.toLocaleString();
        }
    }

    private formatMessage(
        level: LogLevel,
        message: string,
        data?: any,
    ): string {
        const parts: string[] = [];

        if (this.options.includeTimestamp) {
            parts.push(chalk.gray(`[${this.formatTimestamp()}]`));
        }

        if (this.options.includeLevel) {
            const levelColors = {
                INFO: chalk.blue(`[${level}]`),
                WARN: chalk.yellow(`[${level}]`),
                ERROR: chalk.red(`[${level}]`),
                DEBUG: chalk.magenta(`[${level}]`),
                SUCCESS: chalk.green(`[${level}]`),
            };
            parts.push(levelColors[level]);
        }

        parts.push(message);

        if (data !== undefined) {
            parts.push('\n' + JSON.stringify(data, null, 2));
        }

        return parts.join(' ');
    }

    info(message: string, data?: any): void {
        console.log(this.formatMessage('INFO', message, data));
    }

    warn(message: string, data?: any): void {
        console.warn(this.formatMessage('WARN', message, data));
    }

    error(message: string, data?: any): void {
        console.error(this.formatMessage('ERROR', message, data));
    }

    debug(message: string, data?: any): void {
        console.debug(this.formatMessage('DEBUG', message, data));
    }

    success(message: string, data?: any): void {
        console.log(this.formatMessage('SUCCESS', message, data));
    }
}

// Export a default instance with default options
const logger = new Logger();

export default logger;
export { Logger, LoggerOptions };
