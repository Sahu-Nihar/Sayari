import constants from '../constants/Constants';
import { devLogger } from './devLogger';
import { prodLogger } from './prodLogger';

const {ENV} = constants
let logger : any = null;

if (ENV==="LOCAL") {
    logger = devLogger();
}

if (ENV === "PRODUCTION") {
    logger = prodLogger();
}

export { logger };