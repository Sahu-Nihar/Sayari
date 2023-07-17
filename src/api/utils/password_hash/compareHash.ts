import * as bcrypt from 'bcrypt';
import { logger } from '../../../config/logger/index';


// Function compares hashed and plaintext.
// This function is useful for comparing plaintext password and hashed password
// This function is also useful to compare the hashed OTP and plaintext otp.
export const compareHash = async (plainText:string, hash:string) => {
    try {
        let response = await bcrypt.compare(plainText, hash);

        if (!response) return {
            success: false,
            message: 'Incorrect Password!'
        };

        return {
            success: true,
            message: 'Correct Password!'
        };
    }
    catch (error) {
        return {
            success: false,
            message: error
        };
    };
};
