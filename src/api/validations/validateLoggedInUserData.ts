import {VERIFY_EMAIL} from './validateEmail'

export const validateLoggedInUserData = (email:string, password:string) => {
    if (!email) {
        return {
            success: false,
            message: 'Please enter your email ID or phone number!'
        }
    }

    if (!password) {
        return {
            success: false,
            message: 'Please enter your password!'
        }
    }

    let verifyEmail = VERIFY_EMAIL(email);

    if (!verifyEmail) {
        return {
            success: false,
            message: 'You email is invalid!'
        }
    }
    return {
        success: true,
        message: 'Required details provided!'
    }
}