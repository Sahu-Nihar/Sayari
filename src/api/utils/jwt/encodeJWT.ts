import * as jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const pathToKey = path.join('src/config/encryptionKey', '/', 'privateKey.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, { encoding: "utf-8" });

import { logger } from '../../../config/logger/index';

// Generates the ID-Token using jwt.
// I am using RSA algorithm for the jwt.
// I am also using asymmetric encryption keys using pkcs1
// Encryption keys are stored in pem file.
export const encodeIdToken = (userID:number) => {
    const expiresIn = '1d';

    const payload = {
        userID: userID,
        time: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: 'RS256'
    });

    return {
        token: `Bearer ${signedToken}`,
        expires: expiresIn
    };
};

// Generates refresh token using jwt.
export const encodeRefreshToken = (userID:number, uniqueToken:string) => {
    const expiresIn = '1 year';

    const payload = {
        userID: userID,
        userAuthToken: uniqueToken
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: 'RS256'
    });

    return {
        token: `Bearer ${signedToken}`,
        expires: expiresIn
    };
};

// logger.debug('Encode ID Token: %s', encodeIdToken(1234567));
// logger.debug('Encode Refresh Token: %s', encodeRefreshToken(1234567, 'abcdefghij'));