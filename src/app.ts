//  Modules import
import * as express from 'express';
import * as cors from 'cors';

// Custom import
import constants from './config/constants/Constants';
import { logger } from './config/logger/index';
import { sequelize } from './database';

// Import routes
import userRouter from './api/routes/user';
import questionRouter from './api/routes/question';
import commentRouter from './api/routes/comment';
import answerRouter from './api/routes/answer';

const { PORT, API_VERSION } = constants;

// Initialize Express App
const app = express();

// Cors middleware options
const corsOptions = {
    origin: true,
    method: "GET, HEAD, PUT, PATCH, POST, DELETE",
    optionsSuccessStatus: 200
};

// Add cors, body-parser and urlencoded to express app
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Demo route to test server connection
app.get("/", (req:express.Request, res:express.Response) => {
    res
    .status(200)
    .json({
        success: true,
        message: 'Welcome to Sayari Project!'
    });
});

// Routes
app.use(API_VERSION, userRouter);
app.use(API_VERSION, questionRouter);
app.use(API_VERSION, commentRouter);
app.use(API_VERSION, answerRouter);

// Use port to establish connection with the server
// Authenticate DB connection and sync created tables in the DB
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
    sequelize
        .authenticate()
        .then(async () => {
            logger.info("Database Connected!");

            try {
                await sequelize.sync();
            }
            catch (error: any) {
                logger.error(error.message)
            }
        })
        .catch((e: any) => {
            logger.error(e.message)
        });
});