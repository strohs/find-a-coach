import express from 'express';
import coachesService from '../services/coaches.service';
import debug from "debug";
import {validateStringLength, validIntegerBetween} from "../../common/validators/validators";
import bcrypt from "bcryptjs";
import aqp from "api-query-params";
import ApiError from "../../common/errors/ApiError";

const log: debug.IDebugger = debug('app:coaches-middleware');

/**
 * Singleton middleware for Coach CRUD Requests.
 * This class contains validation functions for coach related request parameters
 */
class CoachesMiddleware {

    /**
     * ensures that required fields for creating a coach have been sent in the request
     */
    async validateRequiredCoachBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.email && req.body.password && req.body.firstName && req.body.lastName &&
            req.body.description && req.body.expertise && req.body.hourlyRate && req.body.imageUrl) {
            next();
        } else {
            res.status(400).send({
                message: `Missing a required field: email, password, firstName, lastName, description, expertise, hourlyRate, imageUrl`,
            });
        }
    }

    /**
     * checks query parameters in the Request and ensures that any unknown parameters are rejected with
     * a 400 Response Code
     */
    async validateQueryParams(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            // the filter names we will accept, all others are ignored
            const allowedFilterParams = ['email', 'expertise', 'firstName', 'lastName', 'createdAt', 'description', 'hourlyRate'];
            let params = aqp(req.query, {
                // page mapped to skip
                skipKey: 'page',
                whitelist: allowedFilterParams,
            });

            // default the limit to 10 and skip to 1 if they were not passed
            params = { limit: 10, skip: 1, ...params };
            log(`aqp query object is`, params);

            // validate limit and page
            if (params.limit < 1 || params.limit > 1000) {
                res.status(400).send({
                    message: `limit parameter must be greater than 0 and less than equal to 1000, limit=${params.limit}`
                })
            } else if (params.skip < 0) {
                res.status(400).send(
                    {message: `page parameter must be greater than 0, page=${params.skip}`}
                )
            } else {
                req.aqp = params;
                next();
            }
        } catch (e) {
            next(e);
        }
    }

    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const coach = await coachesService.coachEmailExists(req.body.email);
            if (coach) {
                res.status(400).send({message: `Coach email: ${req.body.email} already exists`});
            } else {
                next();
            }
        } catch (e) {
            next(e);
        }
    }

    /**
     * make sure the user performing the request, can only PUT their own data and NOT another coach's.
     * todo should we allow users to change their e-mail, or should this be an ADMIN only functionality
     */
    async validateSameEmailBelongToSameCoach(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const coach = await coachesService.getCoachByEmail(req.body.email);
            if (coach && coach.id === req.params.coachId) {
                next();
            } else {
                res.status(400).send({ message: `can't update email that doesn't belong to you` });
            }
        } catch (e) {
            next(e);
        }
    }


    // if an email was received for a patch request, it must belong to the coach
    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // Here we need to use an arrow function to bind `this` correctly

        if (req.body.email) {
            req.body.email = req.body.email.trim();
            log('validating patch email', req.body.email);
            await this.validateSameEmailDoesntExist(req, res, next);
        } else {
            next();
        }
    };

    async validateCoachExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const coach = await coachesService.coachExists(req.params.coachId);
            if (coach) {
                next();
            } else {
                res.status(404).send({
                    message: `coach ${req.params.coachId} not found`,
                });
            }
        } catch (e) {
            next(e);
        }
    }

    // TODO replace this with a function that validates the JSON web token and stores validated coach into req.coach
    // extracts the coach's id from the request body and stores it in request.params
    async extractCoachId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.coachId;
        next();
    }

    // validate the limit and page query parameters. If they are not present, else default them
    async validateLimitAndPage(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.query.limit) {
            // the limit parameter must be an integer > 0
            if (!validIntegerBetween(req.query.limit.toString(), 1, 100)) {
                res.status(400).send( { message: `limit parameter must be an integer greater than 0 abd less than 199, limit=${req.query.limit}` });
            }
        } else {
            log(`defaulting limit=10`);
            req.query.limit = '10';
        }

        // the page parameter must be integer > 0
        if (req.query.page) {
            if (!validIntegerBetween(req.query.page.toString(), 1)) {
                res.status(400).send( { message: `page=${req.query.page} but page parameter must be an integer >= 1` });
            }
        } else {
            log(`defaulting page=1`);
            req.query.page = '1';
        }
        next();
    }

    async validatePasswordLength(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const pwdMin = 8;
        const pwdMax = 128;
        if (req.body.password && !validateStringLength(req.body.password, pwdMin, pwdMax)) {
            res.status(400).send({ message: `password must be between ${pwdMin} and ${pwdMax} characters`});
        } else {
            next();
        }
    }

    // attempts to encrypt req.body.password and stores the encrypted password back in req.body.password
    async encryptPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 12);
            }
            next();
        } catch (e) {
            log(`ERROR: trying to bcrypt password:${req.body.password}  ${e}`);
            throw new ApiError(500);
        }
    }

    // validates that only allowed PATCH fields where sent in the request body
    async validatePatchProperties(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // these are the fields that can be patched...
        const allowedPatchFields = [
            'email',
            'password',
            'firstName',
            'lastName',
            'description',
            'expertise',
            'hourlyRate',
            'imageUrl',
        ];
        const invalidKeys = Object.keys(req.body).filter(patchKey => {
            // id field is added by middleware to the request body
            return patchKey !== 'id' && !allowedPatchFields.includes(patchKey);
        });
        if (invalidKeys.length > 0) {
            log(`invalid patch fields found ${invalidKeys.join()}`);
            res.status(400).send({
                message: `cannot patch the following fields: ${invalidKeys.join()}. Valid fields are: ${allowedPatchFields.join(',')}`
            });
        } else {
            next();
        }
    }
}

export default new CoachesMiddleware();