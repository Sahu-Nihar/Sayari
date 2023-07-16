import express, {Request, Response} from 'express';
import cors from 'cors';

import constants from './config/constants/Constants';
import { logger } from './config/logger/index';

const {PORT} = constants

const app = express();

const corsOptions = {
    origin: true,
    method: "GET, HEAD, PUT, PATCH, POST, DELETE",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res
    .status(200)
    .json({
        success: true,
        message: 'Welcome to Sayari Project!'
    });
});

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));