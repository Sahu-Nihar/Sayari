// Import db secrets from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// This file has db secrets that will be selected according to ENV variable available in .env file
export default {
    HOST_LOCAL:"localhost",
    USER_LOCAL: process.env.DB_USER,
    PASSWORD_LOCAL: process.env.DB_PWD,
    DB_LOCAL: process.env.DB_TABLE,

    HOST_STAGE: "",
    USER_STAGE: "",
    PASSWORD_STAGE: "",
    DB_STAGE: "",

    HOST_PROD: "",
    USER_PROD: "",
    PASSWORD_PROD: "",
    DB_PROD: "",

    dialect: 'postgres',
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 1000
    }
}