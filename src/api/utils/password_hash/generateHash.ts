import * as bcrypt from 'bcrypt';
import constants from '../../../config/constants/Constants';
import { logger } from '../../../config/logger/index';

const { SALT_ROUND } = constants;

// Function generates SALT for hashing password or any plain text data.
const generateSalt = async (SALT_ROUND: number) => {
    const salt = await bcrypt.genSalt(SALT_ROUND);
    return salt;
};

// Function generates HASHED value for plaintext provided.
export const generateHash = async (password: string) => {
    const salt = await generateSalt(SALT_ROUND);
    const hash = await bcrypt.hash(password, salt);
    logger.warn('Generated hashed password: %s', hash);
    return {
        HASH: hash,
        SALT: salt
    };
};