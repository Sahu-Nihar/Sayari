import { Op } from 'sequelize';
import * as randomToken from 'rand-token';
import { User } from '../models/user.model';
import { encodeIdToken, encodeRefreshToken } from '../utils/jwt/encodeJWT';
import { generateHash } from '../utils/password_hash/generateHash';
import { compareHash } from '../utils/password_hash/compareHash';
import { transporter } from '../utils/mailer/transporter';
import { mailOptions } from '../utils/mailer/mailOptions';
import { logger } from '../../config/logger/index';
import { validateUserData } from '../validations/validateUserData';
import { validateOTPDetails } from '../validations/validateOTPDetails';
import { validateLoggedInUserData } from '../validations/validateLoggedInUserData';


// Validate if user has email address registered
const validateUserExist = async (email:string) => {
    try {
        let emailExist = await User.findOne({
            where: {
                email: email
            }
        });

        if (emailExist != null) return {
            success: false,
            message: 'You are already registered. Login to continue!'
        }
        return {
            success: true,
            message: 'User does not exist!'
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error
        }
    }
};

// Enter user data in to user table with required fields: Name, Email.
const createNewUser = async (newUserData:any) => {
    try {
        let newUser = await User.create({ name: newUserData.name, email: newUserData.email });

        if (!newUser) return {
            success: false,
            message: 'Not registered!'
        };

        return {
            success: true,
            message: 'User created!',
            data: newUser.dataValues
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Update user table for new user created with other data: SALT, Hashed password, uniqueToken and send OTP via email for email verification
// Unique token is essential for generating refresh token.
const createNewUserAuth = async (newUserAuthData:any, userId:number, userStatus:string) => {
    try {
        let newUserAuth = await User.update(newUserAuthData, {
            returning: true,
            where: { id: userId }
        });

        if (!newUserAuth) return {
            success: false,
            message: 'Not registered!'
        };

        if (userStatus == 'inactive') {
            let sendOTP = await sendOTPVerificationEmail(userId, newUserAuthData.emailId);
            if (!sendOTP.success) return sendOTP;
        }

        let userDetails = await User.findByPk(userId);


        return {
            success: true,
            message: 'User Auth created and OTP sent!',
            data: userDetails?.dataValues
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Generate OTP for email verification and add the hashed otp and otp expiry date in the user table.
const sendOTPVerificationEmail = async (userId:number, emailId:string) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        let mailOp = mailOptions(emailId, otp);

        const hashedOTP = await generateHash(otp);

        let updateValue = {
            verificationToken: hashedOTP.HASH,
            expiresAt: Date.now() + 600000
        };

        const updateUser:any = await User.update(updateValue, {
            returning: true,
            where: { id: userId }
        });

        if (updateUser[1] == 0) return {
            success: false,
            message: 'Could not update OTP and expiresAt'
        };

        const sendOTPMail = await transporter.sendMail(mailOp);

        if (sendOTPMail.accepted.length == 0) return {
            success: false,
            message: 'Could not send OTP!'
        };

        return {
            success: true,
            message: 'OTP sent'
        };
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Verify Auth details for the new user created: Expiry date of otp, Hashed otp and uniqueToken.
const verifyAuthDetails = async (userId:string) => {
    try {
        let searchUser = await User.findByPk(userId);

        if (!searchUser) return {
            success: false,
            message: 'User does not exist!'
        };

        let expireDate = searchUser.dataValues.expiresAt;
        let hashedOTP = searchUser.dataValues.verificationToken;
        let uniqueToken = searchUser.dataValues.uniqueToken;

        return {
            success: true,
            message: 'Auth details verified!',
            data: {
                expiresAt: expireDate,
                storedOTP: hashedOTP,
                uniqueToken: uniqueToken
            }
        };
    }
    catch (error:any) {
        return {
            success: true,
            message: error.message
        };
    };
};

// Validate if OTP has expired, OTP expires 10 minutes after sending it via email.
const validateOTPExpired = async (userId:number, expireDate:any) => {
    try {
        // otp expired
        if (expireDate < Date.now()) {
            let updateAuth = await updateUserAuth(userId);

            return updateAuth;
        }

        return {
            success: true,
            message: 'OTP has not expired!'
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Verify the authenticity of OTP sent through email.
const verifyOTP = async (OTP:string, hashedOTP:string) => {
    try {
        let compareOTP = await compareHash(OTP, hashedOTP);

        if (!compareOTP.success) return {
            success: false,
            message: 'Invalid code passed. Check your inbox!'
        };

        return {
            success: true,
            message: 'OTP verified!'
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// After otp has been verified, register the user by making the status active.
const updateUserTable = async (userId:string) => {
    try {
        let updateUserTable:any = await User.update({ status: 'active' }, {
            returning: true,
            where: { id: userId }
        });

        if (updateUserTable[1] == 0) return {
            success: false,
            message: 'Could not update user status!'
        };

        return {
            success: true,
            message: 'OTP verified!'
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// if otp has expired, remove the expire date and verification token i.e hashed otp from the user table.
const updateUserAuth = async(userId:number) => {
    try {
        let updateAuth:any = await User.update({ expiresAt: null, verificationToken: null }, {
            returning: true,
            where: { id:userId }
        });

        if (updateAuth[1] == 0) return {
            success: false,
            message: 'Expires At and verificationToken could not be updated!'
        };

        return {
            success: true,
            message: 'Expires At and verificationToken deleted!',

        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Validates if the user is registered with the system.
// Checks for email address and status of the user.
// User can only be active if it has verified its email id with the provided OTP in its email.
// Also checks for the password entered if it matches with the hashed password stored in db.
const validateRegisteredUser = async (email:string, password:string) => {
    try {
        let validateUserStatus = await User.findOne({
            where: {
                [Op.and]: [
                    { email: email },
                    { status: 'active' }
                ]
            }
        });

        if (!validateUserStatus) return {
            success: false,
            message: 'User has not registered with us.'
        };

        if (validateUserStatus.dataValues.status == 'inactive') return {
            success: false,
            message: 'Verify your email!'
        }

        let hashedPassword = validateUserStatus.dataValues.password;

        let validatePassword = await compareHash(password, hashedPassword);

        if (!validatePassword.success) return validatePassword;

        return {
            success: true,
            message: 'User is registered!',
            data: validateUserStatus.dataValues
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Searches for user with provided userId in the user table.
export const findUserById = async (userId:number) => {
    try {
        const returnData = await User.findByPk(userId);

        if (!returnData) return {
            success: false,
            message: 'User not found!'
        };

        if (returnData.dataValues.status == 'inactive') return {
            success: false,
            message: 'Email verification is required!'
        }

        return {
            success: true,
            message: 'User found!',
            data: returnData.dataValues
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Updates the user table with new uniqueToken and status after user has logged in.
const updateLoggedInUser = async (updateData:any, userId:number) => {
    try {
        const updateUser:any = await User.update(updateData, {
            returning: true,
            where: {
                id: userId
            }
        });

        if (updateUser[1] < 1) return {
            success: false,
            message: 'Could not update user!'
        } 

        const modifiedData = await findUserById(userId);

        if (!modifiedData.success) return modifiedData;

        return {
            success: true,
            message: 'User table has been updated!',
            data: modifiedData.data
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Add user service which add user details in db and sends otp to the user for email verification to register it in system.
export const addUserService = async (userData:any) => {
    try {
        let { email, password } = userData;

        let checkUserData = validateUserData(userData);

        if (!checkUserData.success) return checkUserData;

        let checkUserExist = await validateUserExist(email);

        if (!checkUserExist.success) return checkUserExist;

        let newUserData = checkUserData.data;

        let newUser = await createNewUser(newUserData);

        if (!newUser.success) return newUser;

        let hashing = await generateHash(password);
        let { HASH, SALT } = hashing;
        
        const uniqueToken = randomToken.uid(255);

        let user = newUser.data

        let newUserAuthData = {
            salt: SALT,
            password: HASH,
            uniqueToken,
            emailId: email
        };

        let newUserAuth = await createNewUserAuth(newUserAuthData, user!.id, user!.status);

        if (!newUserAuth.success) return newUserAuth;

        const returnPayload = {
            id: user!.id,
            name: user!.name,
            email: user!.email
        }

        return {
            success: true,
            message: 'Verify using otp sent in email!',
            data: returnPayload
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Verify OTP service that verifies the sent otp after user has signed up for authenticity of it's email id.
// Once registered generate ID token and refresh token for the user.
export const verifyOTPService = async (userData:any) => {
    try {
        let { userId, otp } = userData;

        let verifyDetails = validateOTPDetails(userId, otp);

        if (!verifyDetails.success) return verifyDetails;

        let getAuthDetails = await verifyAuthDetails(userId);

        if (!getAuthDetails.success) return getAuthDetails;

        let expiresAt = getAuthDetails.data!.expiresAt;
        let storedOTP = getAuthDetails.data!.storedOTP;
        let uniqueToken = getAuthDetails.data!.uniqueToken;

        const verifyOTPExpiry = await validateOTPExpired(userId, expiresAt);

        if (!(verifyOTPExpiry.success && verifyOTPExpiry.message == 'OTP has not expired!')) return {
            success: false,
            message: verifyOTPExpiry.message
        };

        let validateOTP = await verifyOTP(otp, storedOTP);

        if (!validateOTP.success) return validateOTP;

        let updateUser = await updateUserTable(userId);

        if (!updateUser.success) return updateUser;

        const tokenObject = encodeIdToken(userId);
        const refreshTokenObject = encodeRefreshToken(userId, uniqueToken);

        return {
            success: true,
            message: 'User email has been verified!',
            data: {
                id: userId,
                accessToken: tokenObject.token,
                refreshToken: refreshTokenObject.token,
                status: 'active'
            }
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// User sign-in service
// This is a 2 step process.
// First user is searched and verified
// once above process is done, it is sent to successful login.
export const userSignInService = async (userData:any) => {
    try {
        const { email, password } = userData;

        const verifyDetails = validateLoggedInUserData(email, password);

        if (!verifyDetails.success) return verifyDetails;

        let verifyIfRegistered = await validateRegisteredUser(email, password);

        if (!verifyIfRegistered.success) return verifyIfRegistered;

        const searchedUser = verifyIfRegistered.data;

        return successfulLogin(searchedUser, 'VALIDATE');
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
};

// Once user has been validated, it's data is updated,
// Once updated user is provided with new idToken and refreshToken 
const successfulLogin = async (searchedUser:any, loginType:string) => {
    try {
        const uniqueToken = randomToken.uid(255);

        const userID = searchedUser.id;

        const updateData = {
            uniqueToken,
            status: 'active'
        };

        const verifyUserUpdate = await updateLoggedInUser(updateData, userID);

        if (!verifyUserUpdate.success) return verifyUserUpdate;

        let updatedUserDetails = verifyUserUpdate.data;

        const idToken = encodeIdToken(userID);
        const refreshToken = encodeRefreshToken(userID, updatedUserDetails!.uniqueToken);

        let loginInfo = {
            id: userID,
            email: updatedUserDetails!.email,
            status: updatedUserDetails!.status,
            idToken: idToken.token,
            refreshToken: refreshToken.token
        }

        return {
            success:true,
            message:"You have successfully logged-in",
            data: loginInfo
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}