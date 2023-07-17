import { Sequelize } from 'sequelize-typescript'
import dbConfig from './config/db.config';
import constants from './config/constants/Constants';

const DB = dbConfig['DB_' + constants.ENV];
const USER = dbConfig['USER_' + constants.ENV];
const PWD = dbConfig['PASSWORD_' + constants.ENV];
const HOST = dbConfig['HOST_' + constants.ENV];

// establishes Server and DB connection using Sequelize ORM.
// Requires: DB_NAME, USER_NAME, DB_PASSWORD, DB_HOST, DIALECT: type of relational database used.
export const sequelize = new Sequelize(DB, USER, PWD, {
    host: HOST,
    dialect: 'postgres',
    models: [__dirname + '/models']
});