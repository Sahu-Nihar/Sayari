import constants from '../constants/Constants';
import { devLogger } from './devLogger';
import { prodLogger } from './prodLogger';

// This file chooses what type of logger to use depending on the ENV variable.
const {ENV} = constants
let logger : any = null;

if (ENV==="LOCAL") {
    logger = devLogger();
}

if (ENV === "PRODUCTION") {
    logger = prodLogger();
}

export { logger };