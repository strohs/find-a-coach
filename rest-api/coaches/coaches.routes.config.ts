import {CommonRoutesConfig} from '../common/common.routes.config';
import CoachesController from '../coaches/controllers/coaches.controller';
import CoachesMiddleware from './middleware/coaches.middleware';
import {authenticateToken} from "../common/middleware/validate.token";
import express from 'express';
import tokenHasAdminRole from "../common/middleware/validate.role";

export class CoachesRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'CoachesRoutes');
    }

    configureRoutes(): express.Application {

        this.app.route('/coaches')
            .get(
                CoachesMiddleware.validateQueryParams,
                //CoachesMiddleware.validateLimitAndPage,
                CoachesController.listCoaches
            )
            .post(
                CoachesMiddleware.validateRequiredCoachBodyFields,
                CoachesMiddleware.validatePasswordLength,
                CoachesMiddleware.encryptPassword,
                CoachesMiddleware.validateSameEmailDoesntExist,
                CoachesController.createCoach
            );

        // this route returns true if a coaches email is already in use, else false
        this.app.route('/coaches/email/:email')
            .get(CoachesController.coachEmailExists);

        // extract the coachId from request params and store it in req.body.id
        this.app.param('coachId', CoachesMiddleware.extractCoachId);


        // GET or DELETE a specific coach. Only admins can delete
        this.app.route(`/coaches/:coachId`)
            .get(
                CoachesMiddleware.validateCoachExists,
                CoachesController.getCoachById,
            )
            .delete(
                authenticateToken,
                tokenHasAdminRole,
                CoachesMiddleware.validateCoachExists,
                CoachesController.removeCoach,
            );

        // PUT new coach data for an existing Coach
        this.app.put('/coaches/:coachId', [
            CoachesMiddleware.validateRequiredCoachBodyFields,
            CoachesMiddleware.validateSameEmailDoesntExist,
            CoachesMiddleware.validatePasswordLength,
            CoachesMiddleware.encryptPassword,
            CoachesController.put
        ]);

        // PATCH individual fields of a Coach
        this.app.patch('/coaches/:coachId', [
            CoachesMiddleware.validatePatchProperties,
            CoachesMiddleware.validatePatchEmail,
            CoachesMiddleware.validatePasswordLength,
            CoachesMiddleware.encryptPassword,
            CoachesController.patch,
        ]);

        return this.app;
    }
}