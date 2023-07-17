import { Request, Response } from 'express';
import { addUserService, verifyOTPService, userSignInService }  from '../services/user.service';
import { logger } from '../../config/logger/index';

export const addUser = async (req:Request, res:Response) => {
    logger.info(req.body);

    const user = await addUserService(req.body);

    if (user.success) {
        res
        .status(201)
        .json(user);
    }
    else {
        res
        .status(400)
        .json(user);
    }
};

export const verifyOTP = async (req:Request, res:Response) => {
    const verification = await verifyOTPService(req.body);

    if (verification.success) {
        res
            .status(200)
            .json(verification);
    }
    else {
        res
            .status(400)
            .json(verification);
    }
};

export const userSignIn = async (req: Request, res: Response) => {
    const user = await userSignInService(req.body);
    
    if (user.success) {
        res
        .status(200)
        .json(user);
    }
    else {
        res
        .status(400)
        .json(user);
    }
};