import constants from '../../config/constants/Constants';

const { EMAIL_REGEX } = constants;

// Validates if the email provided is correct by verifying it with the regex.
export const VERIFY_EMAIL = (email:string) => {
    return EMAIL_REGEX.test(email);
}