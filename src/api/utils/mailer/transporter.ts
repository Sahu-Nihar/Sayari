import * as nodemailer from 'nodemailer';
import { logger }  from '../../../config/logger/index';
import constants from '../../../config/constants/Constants';

const { MAILER_AUTH_EMAIL, MAILER_AUTH_PASS } = constants;

// This is a transport layer for the nodemailer for sending OTP using nodemailer.
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAILER_AUTH_EMAIL,
        pass: MAILER_AUTH_PASS
    }
});

// Verifies if the transporter is working.
transporter.verify((error, success) => {
    if (error) {
        throw error;
    }
    else {
        logger.info(`Ready to send OTP for verification: ${success}`);
    }
});

