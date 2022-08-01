import {CommonRoutesConfig} from "../common/common.routes.config";
import CoachingRequestsMiddleware from ".//middleware/coaching.requests.middleware"
import express from "express";
import CoachingRequestsController from "./controllers/coaching.requests.controller";
import {authenticateToken} from "../common/middleware/validate.token";

/**
 * CoachingRequestRoutes
 * Calls middleware and controllers for all coachingRequest routes
 */
export class CoachingRequestsRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'RequestsRoutes');
    }

    configureRoutes(): express.Application {

        this.app.route('/requests')
            // list all coaching requests
            .get(
                CoachingRequestsMiddleware.validateQueryParams,
                authenticateToken,
                CoachingRequestsMiddleware.validateAdminOrCoachIdMatchesTokenId,
                CoachingRequestsController.listRequests,
                )
            // create a new coaching request
            .post(
                CoachingRequestsMiddleware.validateRequiredRequestBodyFields,
                CoachingRequestsController.createRequest,
            );

        // get/delete a specific request by its coachingRequestId
        this.app.route('/requests/:reqId')
            .all([
                authenticateToken,
                CoachingRequestsMiddleware.extractRequestId,
                CoachingRequestsMiddleware.validateReqId,
                CoachingRequestsMiddleware.validateRequestExists,
                CoachingRequestsMiddleware.validateCoachingRequestBelongsToCoach,
            ])
            .get(CoachingRequestsController.getRequestById)
            .delete(CoachingRequestsController.removeRequest)

        // put new request over existing request
        this.app.put('/requests/:reqId', [
            authenticateToken,
            CoachingRequestsMiddleware.validateRequiredRequestBodyFields,
            CoachingRequestsMiddleware.extractRequestId,
            CoachingRequestsMiddleware.validateCoachingRequestBelongsToCoach,
            CoachingRequestsController.put
        ])

        // patch an existing request
        this.app.patch('/requests/:reqId', [
            authenticateToken,
            CoachingRequestsMiddleware.validatePatchProperties,
            CoachingRequestsMiddleware.validatePatchFromEmail,
            CoachingRequestsMiddleware.validatePatchMessage,
            CoachingRequestsMiddleware.validatePatchReply,
            CoachingRequestsMiddleware.validateCoachingRequestBelongsToCoach,
            CoachingRequestsController.patch
        ])

        // get requests for a specific coachId
        // this.app.get('/requests/coaches/:coachId',[
        //     CoachingRequestsMiddleware.validateQueryParams,
        //     CoachingRequestsMiddleware.extractCoachId,
        //     CoachingRequestsMiddleware.validateCoachId,
        //     CoachingRequestsMiddleware.validateCoachIdExists,
        //     CoachingRequestsController.getRequestsByCoachId,
        // ]);

        return this.app;
    }
}