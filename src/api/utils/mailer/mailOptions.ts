import constants from '../../../config/constants/Constants';

const { MAILER_AUTH_EMAIL, MAILER_VERIFICATION_SUBJECT } = constants;

// Generates a template for email to send OTP via email.
export const mailOptions = (EMAIL_ID:string, OTP:string) => {
    return {
        from: MAILER_AUTH_EMAIL,
        to: EMAIL_ID,
        subject: MAILER_VERIFICATION_SUBJECT,
        html: `<p>Enter <b>${OTP}</b> in the app to verify your email address and complete the sign up process</p>
        <p>This code <b>expires in 10 minutes</b>.</p>`,
    };
};