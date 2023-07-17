import { VERIFY_EMAIL } from './validateEmail';

// Validates if all required data and type of data required for each field is correct for user.
export const validateUserData = (userData:any) => {
    const { name, email, password } = userData;

    if (!name || !email || !password) return {
        success: false,
        message: "Please enter required fields for user sign-up, 'name', 'email', 'password'"
    };

    if (password.length < 8) {
        return {
            success: false,
            message: 'Password length must be at least 8 characters!'
        };
    };

    let verifyEmail = VERIFY_EMAIL(email);

    if (!verifyEmail) return {
        success: false,
        message: 'Enter a valid email address!'
    };

    return {
        success: true,
        message: 'Required fields are provided!',
        data: userData
    };
};