import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json } = format;

const prodLogger = () => {

    return createLogger({
        level: 'debug',
        format: combine(
            timestamp(),
            json()
        ),

        defaultMeta: { service: 'user-service' },
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'errors.log',

            })
        ],
    });
}

export {prodLogger};