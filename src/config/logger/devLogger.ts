// Import winston package
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, prettyPrint, label, splat } = format;

// Create Logger for development environment
export const devLogger = () => {
    const myFormat = printf(info => {
        return `[${info.label}] ${info.timestamp} [${info.level}]: ${info.message}`;
    });

    return createLogger({
        level: 'debug',
        format: combine(
            label({ label: 'Sayari' }),
            prettyPrint(),
            colorize(),
            splat(),
            timestamp({ format: "HH:mm:ss" }),
            myFormat
        ),

        transports: [new transports.Console()],
    });
}