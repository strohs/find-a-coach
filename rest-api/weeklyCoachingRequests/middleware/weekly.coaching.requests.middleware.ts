import debug from "debug";
import express, {NextFunction} from "express";
import {validateObjectId} from "../../common/validators/validators";
import aqp from "api-query-params";
import {getWeekOfYear} from "../models/weekly.coaching.request.model";
import coachesService from "../../coaches/services/coaches.service";

const log: debug.IDebugger = debug('app:weekly-coaching-requests-middleware');

class WeeklyCoachingRequestsMiddleware {

    // validate the query string params we will allow when querying weekly coaching request data
    async validateQueryParams(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            // the filter names we will accept, all others are ignored
            const allowedFilterParams = [ 'yearWeek' ];
            const params = aqp(req.query, {
                // page parameter will be mapped to "skip"
                skipKey: 'page',
                whitelist: allowedFilterParams,
            });

            log(`validateQueryParams: aqp query object is`, params);

            // set defaults for limit, skip
            params.limit = params.limit ?? 100;
            params.skip = params.skip ?? 1;

            // validate limit and page
            if (params.limit < 1 || params.limit > 1000) {
                res.status(400).send({
                    message: `limit parameter must be greater than 0 and less than equal to 1000, limit=${params.limit}`
                });
            }
            if (params.skip < 0) {
                res.status(400).send(
                    {message: `page parameter must be greater than 0, page=${params.skip}`}
                );
            }
            // if yearWeek not passed, default it to now
            if (!params.filter.yearWeek) {
                const now = new Date();
                params.filter.yearWeek =`${now.getFullYear()}-${getWeekOfYear(now)}`;
            }
            req.aqp = params;
            next();
        } catch (e) {
            next(e);
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

    // validates that the coachId contained in req.params.coachId exists in the DB. If it does not exist, this
    // function returns a 404 response
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

    // validates that the weekly request id is a valid ObjectId
    async validateReqId(req: express.Request, res: express.Response, next: NextFunction) {
        if (!validateObjectId(req.params.reqId)) {
            res.status(400).send({
                message: `reqId: ${req.params.reqId} is not a valid id`
            });
        } else {
            next();
        }
    }


}

export default new WeeklyCoachingRequestsMiddleware();