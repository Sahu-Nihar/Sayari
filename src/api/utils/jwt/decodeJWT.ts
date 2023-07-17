import * as jsonwebtoken from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const pathToKey = path.join('src/config/encryptionKey', '/', 'publicKey.pem');
const PUB_KEY = fs.readFileSync(pathToKey, { encoding: "utf-8" });

import { logger } from '../../../config/logger/index';

// Decodes the ID-Token using jwt.
// I am using RSA algorithm for the jwt.
// I am also using asymmetric encryption keys using pkcs1
// Encryption keys are stored in pem file.
export const decodeIdToken = (authHeader:string) => {

    const idToken = authHeader.split(" ")[1];

    const loggedInUserId = jsonwebtoken.verify(idToken, PUB_KEY, {algorithms: ['RS256']}, (err:any, payload:any) => {
        if (err) {
            return null;
        }
        else {
            const userID = payload.userID;
            return userID;
        }
    });

    return loggedInUserId;
};

// Decodes the refresh token.
export const decodedRefreshToken = (authHeader:string) => {

    const refreshToken = authHeader.split(" ")[1];

    const loggedInUserRefTok = jsonwebtoken.verify(refreshToken, PUB_KEY, {algorithms: ['RS256']}, (err:any, payload:any) => {
        if (err) {
            return null;
        }
        else {
            const userID = payload.userID;
            const uniqueToken = payload.userAuthToken;

            return {
                userID,
                uniqueToken
            };
        }
    });

    return loggedInUserRefTok;
};

// logger.debug('Decoded ID TOKEN: %o', decodeIdToken('Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEyMzQ1NjcsInRpbWUiOjE2ODk1NDQ4NDY2NjMsImlhdCI6MTY4OTU0NDg0NiwiZXhwIjoxNjg5NjMxMjQ2fQ.d7bC6LEtdNauSnMksIS5OOB7r6S1e5WWHyUAZKmdPlLhBBjkUD_LL2Iwf3IAeUzRgjE9CrHpQz2eyv74vvFS1Jc3EDb5yLWvo5pOq35NiaVK7zcejBjL5SXsrz5ddqk2TxOTWKcwXJDivVdIyoEjFPh8lXsWWNG095Bk85QOZICewcr7k3M7vhQnskY30OvO6r-XDJZIAtaUrl_cK-ERH7k46rf-z0S8TejfL0hKYoEkAISLwmIzxhN-FRmUPaNEJbgMwKggXC4FbMDfzasi7bzNK8ZsYB5kSmcp0CDLKqHJV3eBB4yDXWlyvQ5yXKQjz0ptvOGZM8EVDi8x2kgcRdJDgiFHOoV_gKF75MrMwQi5z008HF0Za385eG3AtG1cWP6yUQRVdios1RRCEXSwVVe6UnIoB9KXeo8pX6yHfVAd2SOCvtlkcwyhsLevouudfZsg9kNTs0pY1yJG6oYTpYMBiybq69CL_5ChgeY0Ku0dtsbJ2mmRkuA-N6RmQzH7YQGp8g6DgxMdOCfdGE1BREWCyubTsy3J4p8aCjxxnq1IPwQG0W_8TWwF06HTAVSSFMCHwD2FCdxWOwTXkO2Z9vPQTNiA3cdFLkVrkGfDquauZWiROkNMKed6h6yRl4cOFDi-PmlaXQcLT4rei9TDZS0zGlIo1g-NRzUdDrL9n5c'))

// logger.debug('Decoded REFRESH TOKEN: %s', decodedRefreshToken('Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEyMzQ1NjcsInVzZXJBdXRoVG9rZW4iOiJhYmNkZWZnaGlqIiwiaWF0IjoxNjg5NTQ0ODQ2LCJleHAiOjE3MjExMDI0NDZ9.ULYTxb2ePSHmdGkpSWiiwaBnoenCsQ27bJztoUMPPKF471oY4f_KqB46cO1cw0Dqot6dwgOY-mw_FlawGwiv-nNo_wa75e0U77odjqYy1b3a4k-bdIRV02j_FnT2id89zytvQKyhO5Sxi1DRjGNIXzJsDBoY3p_qf-AF8o4Qe5w1nHuIhnJQyQ9YH14NhjdFl0Tkr9-F6UX_x9dxlPFhe3HQTmCeO-oKakTLDzr3Q8msRSntTqsenCoheLr4T_53N5B_IODemWELeO9fn0FlJOcM5JMj2PZkp3zDwAJwNovHTJgQfx3C3KWsr_5D_pVI1YopdvWe1BSfQoet_YvIKexXRUOyq050ZHQk-ZsYo54KkegsNgy7UO5gzUPBApzp4CxOd8p_V91jKYSeH3Lyv7zc117ik8NRZ8bGK2hNZOiZsAQID2HMeJNY_58ONPKTUpSgYYuf3q5oCAQh7S9dnE_GeW1pCVJASwaWwxb2rpqhl90Orb1k7n0yOJRZVufG0Qtp4D9P_ejcEVKN_C61a3qyGm30PaQTdIV-MidMA00lP4bN66xVhkZnnLIeYUKqLV6XZ91_eYcNxPUmBaUQu2-Xt698jLIkRLguNWjBiArjIJz-Qovl5BxiPk7zPYCbgcno6JlTobg4kgD2c5lecmH7p390DS35tNE4moUu01o'));