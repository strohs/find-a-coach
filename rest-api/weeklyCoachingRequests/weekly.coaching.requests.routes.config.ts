import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import WeeklyCoachingRequestsMiddleware from "./middleware/weekly.coaching.requests.middleware";
import WeeklyCoachingRequestsController from "./controllers/weekly.coaching.requests.controller";

export class WeeklyCoachingRequestsRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'WeeklyRequestsRoutes');
    }

    configureRoutes(): express.Application {
        // get weekly requests for the specified coachId, allow filtering and sorting using query parameters
        this.app.route('/weeklyRequests/coaches/:coachId')
            .get(
                WeeklyCoachingRequestsMiddleware.validateCoachExists,
                WeeklyCoachingRequestsMiddleware.validateQueryParams,
                WeeklyCoachingRequestsMiddleware.extractCoachId,
                WeeklyCoachingRequestsController.listRequests,
            );

        // get a specific weekly coaching request
        this.app.route('/weeklyRequests/:reqId')
            .all([
                WeeklyCoachingRequestsMiddleware.extractRequestId,
                WeeklyCoachingRequestsMiddleware.validateReqId,
            ])
            .get(WeeklyCoachingRequestsController.getById)

        return this.app;
    }
}