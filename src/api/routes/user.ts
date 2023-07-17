import * as express from 'express';
import { addUser, verifyOTP, userSignIn } from '../controllers/user.controller';

var router = express.Router();

router.post('/signUp', addUser);
router.post('/user/verifyOtp', verifyOTP);
router.post('/signIn', userSignIn);

export default router;


