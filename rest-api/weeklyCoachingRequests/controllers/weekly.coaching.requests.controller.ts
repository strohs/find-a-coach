import debug from "debug";
import express from "express";
import wcrService from "../services/weekly.coaching.request.service";

const log: debug.IDebugger = debug('app:weekly-coaching-requests-controller');

class WeeklyCoachingRequestsController {

    constructor() {
        log(`WeeklyCoachingRequestsController created`);
    }

    // /weeklyRequests?coachId=1234&year=2021&weekOfYear=1&limit=10&page=1
    // /weeklyRequests/123456234

    async listRequests(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const dto = await wcrService.getWeeklyRequestsForCoach(req.params.coachId, req.aqp);
            if (dto) {
                res.status(200).send(dto);
            } else {
                res.status(204).send();
            }
        } catch (e){
            next(e);
        }
    }

    // get a weekly coaching request document by it's primary id
    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const wcrDto = await wcrService.readById(req.params.reqId);
            if (wcrDto) {
                res.status(200).send(wcrDto);
            } else {
                // in this example, existence of reqId is determined after returning from service, should we continue
                // to do this in middleware, like the other routes, or do it in controller
                res.status(400).send({ message: `request id not found ${req.params.reqId}`});
            }
        } catch (e){
            next(e);
        }
    }
}

export default new WeeklyCoachingRequestsController();