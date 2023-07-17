// Import secrets from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// This object contains all constants that are used globally in this project.
export default {
    ENV: process.env.ENVIRONMENT,
    PORT: process.env.PORT,
    API_VERSION: "/api/v1",
    SALT_ROUND: 10,
    EMAIL_REGEX: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/,
    MAILER_AUTH_EMAIL: process.env.AUTH_EMAIL,
    MAILER_AUTH_PASS: process.env.AUTH_PASS,
    MAILER_VERIFICATION_SUBJECT: process.env.VERIFICATION_SUBJECT
};