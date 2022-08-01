import express, {NextFunction} from 'express';
import debug from "debug";
import coachesDao from '../../coaches/daos/coaches.dao';
import requestsService from '../services/coaching.requests.service';
import * as EmailValidator from 'email-validator';
import {filterNonMatchingProperties, validateObjectId, validIntegerBetween} from "../../common/validators/validators";
import aqp from "api-query-params";
import {TokenData} from "../../common/interfaces/token.data";


const log: debug.IDebugger = debug('app:coaching-requests-middleware');

class CoachingRequestsMiddleware {

    /**
     * validate the query string params we will allow when querying coaching request data
     * @param req
     * @param res
     * @param next
     */
    validateQueryParams = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            // the filter names we will accept, all others are ignored
            const allowedFilterParams = ['fromEmail', 'createdAt', 'coachId', 'message', 'reply', 'replyAt'];
            let params = aqp(req.query, {
                // page mapped to skip
                skipKey: 'page',
                whitelist: allowedFilterParams,
            });

            // if coachId was passed as a query parameter, validate the coach exists
            if (req.query.coachId) {
                const coach = await coachesDao.getCoachById(req.query.coachId as string);
                if (!coach) {
                    res.status(404).send({
                        message: `coachId: ${req.query.coachId} not found`
                    });
                    return;
                } else {
                    // rename coachId property in params.filter, to "coach", as this is the parameter DAOs will be
                    // using when working with coach data
                    params.filter.coach = coach;
                    delete params.filter.coachId;
                }
            }

            // default limit parameter to 50 and skip to 1 if they were not passed
            params = { limit: 50, skip: 1, ...params };

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



    /**
     * validates that the request body contains required fields AND they are not empty
     * @param req
     * @param res
     * @param next
     */
    async validateRequiredRequestBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        if (req.body && req.body.message && req.body.fromEmail && req.body.coachId) {
            next();
        } else {
            res.status(400).send({
                message: `missing a required field: message, fromEmail, coachId`
            });
        }
    }

    /**
     * validates that a coaching request exists. The request's id should be stored in req.body.id
     * If the request does exist, it will be stored in the request object under the key 'coachingRequest'
     * @param req
     * @param res
     * @param next
     */
    async validateRequestExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const coachingRequestExist = await requestsService.requestExists(req.body.id);
            if (coachingRequestExist) {
                req.coachingRequestExistDto = coachingRequestExist;
                next();
            } else {
                res.status(404).send({
                    message: `request id: ${req.params.reqId} not found`
                })
            }
        } catch (e) {
            next(e);
        }
    }

    static validateHasAdminRole(tokenData: TokenData): boolean {
        return tokenData.roles.includes("admin");
    }

    /**
     * validates the requested coaching request exists, and that the user making the request is the coach that
     * owns the coaching request OR the user has the admin role.
     * This function must be run after validateToken and after validateRequestExists
     * @param req
     * @param res
     * @param next
     */
    async validateCoachingRequestBelongsToCoach(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {

        // handle admin case
        if (req.authToken && CoachingRequestsMiddleware.validateHasAdminRole(req.authToken)) {
            next();
        } else if (req.coachingRequestExistDto.coachId === req.authToken?.id) {
            next();
        } else {
            res.status(403).send({
                message: `coaching request ${req.params.reqId} does not belong to user making the request`
            })
        }
    }

    /**
     * If coachId was sent as query parameter, this function validates the coachId query parameter matches the id in
     * the token. This is to ensure that coaches can only retrieve coaching requests that belong to them.
     * Anyone with the admin role can always retrieve requests for any coach
     * NOTE: this function assumes that the token is present and has already been validated. It assumes the existence
     * of the following request properties:  req.isAuth, and req.authToken
     * @param req
     * @param res
     * @param next
     */
    async validateAdminOrCoachIdMatchesTokenId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // if token has admin role, then allow this action
        if (req.authToken?.roles.includes("admin")) {
            log(`token has admin role, allowing request`);
            next();
        } else {
            // check if a coachId was sent as a query param, it must match the token id of the JWT
            const reqCoachId = req.aqp?.filter?.coach?.id;
            if (reqCoachId && reqCoachId === req.authToken?.id) {
                next();
            } else {
                res.status(403).send({
                    message: `Coaches are not allowed to view or modify coaching requests of other coaches. requested coachId was ${reqCoachId}`
                })
            }
        }
    }

    // copies req.params.reqId into req.body.id
    async extractRequestId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.reqId;
        next();
    }

    // copies req.params.coachId into req.body.coachId
    async extractCoachId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.coachId = req.params.coachId;
        next();
    }


    // validates the req.query.coachId parameter is present and if it is, calls the DB to see if the coach exists and
    // stores the ICoachModel in  req.body.coach. If the coach does not exist, a 404 HTTP response is sent to the client
    // validateCoachIdExists = async (
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction,
    // ) => {
    //     try {
    //         if (req.query.coachId) {
    //             const id: string = req.query.coachId as string;
    //             const coach = await coachesDao.getCoachById(id);
    //             if (coach) {
    //                 req.body.coach = coach;
    //                 next();
    //             } else {
    //                 res.status(404).send({
    //                     message: `coachId ${req.body.coachId} not found`
    //                 })
    //             }
    //         } else {
    //             next();
    //         }
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    /**
     * validate the limit and page query string parameters; otherwise default them
     * @param req
     * @param res
     * @param next
     */
    async validateLimitAndPage(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.query.limit) {
            // the limit parameter must be an integer > 0
            if (!validIntegerBetween(req.query.limit.toString(), 1)) {
                res.status(400).send( {
                    message: `limit=${req.query.limit} but limit parameter must be an integer >= 1`
                });
            }
        } else {
            log(`defaulting limit=10`);
            req.query.limit = '20';
        }

        // the page parameter must be integer > 0
        if (req.query.page) {
            if (!validIntegerBetween(req.query.page.toString(), 1)) {
                res.status(400).send( {
                    message: `page=${req.query.page} but page parameter must be an integer >= 1`
                });
            }
        } else {
            log(`defaulting page=1`);
            req.query.page = '1';
        }
        next();
    }

    /**
     * validates fromEmail is a valid email address
     * @param req
     * @param res
     * @param next
     */
    async validateFromEmail(req: express.Request, res: express.Response, next: NextFunction) {
        req.body.fromEmail = req.body.fromEmail.trim();
        if (!EmailValidator.validate(req.body.fromEmail)) {
             res.status(400).send({
                 message: `fromEmail: ${req.body.fromEmail} is not a valid email address`
             });
        } else {
            next();
        }
    }

    /**
     * validates the request id is a valid ObjectId
     * @param req
     * @param res
     * @param next
     */
    async validateReqId(req: express.Request, res: express.Response, next: NextFunction) {
        if (!validateObjectId(req.params.reqId)) {
            res.status(400).send({
                message: `reqId: ${req.params.reqId} is not a valid id`
            });
        } else {
            next();
        }
    }

    /**
     * validates the coach id is a valid ObjectId
     * @param req
     * @param res
     * @param next
     */
    async validateCoachId(req: express.Request, res: express.Response, next: NextFunction) {
        if (!validateObjectId(req.body.coachId)) {
            res.status(400).send({
                message: `coachId: ${req.body.coachId} is not a valid id`
            });
        } else {
            next();
        }
    }

    /**
     * validate the fromEmail is not 'falsy', and is a "well-formed" email address
     * @param req
     * @param res
     * @param next
     */
    validatePatchFromEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        log('validating patch fromEmail', req.body.fromEmail);
        if (req.body.fromEmail) {
            req.body.fromEmail = req.body.fromEmail.trim();
        }
        next();
    };

    /**
     * checks for presence of the message field, and if present, it most be at least one character
     * @param req
     * @param res
     * @param next
     */
    validatePatchMessage = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        log('validating patch message', req.body.message);
        if (req.body.message) {
            req.body.message = req.body.message.trim();
        }
        next();
    };

    /**
     * if the "reply" field is sent in a PATCH request, we must default the "replyAt" field to the current Date
     * @param req
     * @param res
     * @param next
     */
    validatePatchReply = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        log('validating path reply', req.body.reply);
        if (req.body.reply) {
            req.body.replyAt = Date.now();
        }
        next();
    }


    /**
     * validates that only permitted fields were sent in a patch request. Unknown fields are rejected with a HTTP 400
     * @param req
     * @param res
     * @param next
     */
    async validatePatchProperties(req: express.Request, res: express.Response, next: express.NextFunction) {
        const allowedPathProps = ['message', 'fromEmail', 'id', 'reply'];
        const invalidKeys = filterNonMatchingProperties(allowedPathProps, req.body);
        if (invalidKeys.length > 0) {
            res.status(400).send({
                message: `invalid field(s) sent in patch request: ${invalidKeys.join()}. Valid fields are ${allowedPathProps.join(',')}`
            });
        } else if (Object.keys(req.body).length < 1) {
            res.status(400).send({ message: `no properties sent in patch request`});
        } else {
            next();
        }
    }
}

export default new CoachingRequestsMiddleware();