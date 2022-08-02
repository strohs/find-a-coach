import dotenv from "dotenv";
// load environment variables first
dotenv.config();

// possibly refactor each config into a sep. dir
import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import {CommonRoutesConfig} from './common/common.routes.config';
import {CoachesRoutes} from './coaches/coaches.routes.config';
import {CoachingRequestsRoutes} from "./coachingRequests/coaching.requests.routes.config";
import {WeeklyCoachingRequestsRoutes} from "./weeklyCoachingRequests/weekly.coaching.requests.routes.config";
import {MongooseClient} from "./database/mongodb/mongooseClient";
import {generateRandomData} from "./utils/boot-strap/genRandomData";
import './globals/express.globals'; // notify typescript of additional request properties we will use in the Request object
import ApiError from "./common/errors/ApiError";
import LoginRoutes from "./login/login.routes.config";
import sanitizeRequestBody from "./common/middleware/sanitize.request.body";


const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT;
// array of routes we will use
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');


// middleware to parse all incoming requests as JSON
app.use(express.json());

// middleware to allow cross-origin requests
app.use(cors());

// sanitize any req.body to prevent mongo-db injection attacks
app.use(sanitizeRequestBody);

// prepare the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the routes being used in this app
routes.push(new LoginRoutes(app));
routes.push(new CoachesRoutes(app));
routes.push(new CoachingRequestsRoutes(app));
routes.push(new WeeklyCoachingRequestsRoutes(app));


// here we are configuring the application wide error handler
app.use((error: ApiError, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const code = error.code || 500;
    const message = error.message || `systems are down, please try again later`;
    res.status(code)
        .json({
            message: message,
        });
});

// try to connect to the database
const dbClient = new MongooseClient(process.env.MONGODB_URI as string);
dbClient
    .connect()
    .then(res => {
        // this is a simple route to make sure everything is working properly
        const runningMessage = `Server running at http://localhost:${port}`;
        app.get('/', (req: express.Request, res: express.Response) => {
            res.status(200).send(runningMessage)
        });

        // bootstrap dummy data, coaches, coachingRequests
        const should_bootstrap = process.env.BOOTSTRAP_DATA || 'false';
        if (should_bootstrap.toLowerCase() == 'true') {
            generateRandomData()
                .then(() => {
                    console.log('generate random data done', res);
                })
        }

        // start the server
        server.listen(port, () => {
            routes.forEach((route: CommonRoutesConfig) => {
                debugLog(`Routes configured for ${route.getName()}`);
            });
            // our only exception to avoiding console.log(), because we
            // always want to know when the server is done starting up
            console.log(runningMessage);
        });
    })
    .catch(err => {
            console.error(err);
    });






