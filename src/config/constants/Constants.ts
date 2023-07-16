import * as dotenv from 'dotenv';
dotenv.config();

export default {
    ENV: process.env.ENVIRONMENT,
    PORT: process.env.PORT,
    API_VERSION: process.env.API_VERSION,
};