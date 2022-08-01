import express from "express";
import requestsService from "../services/coaching.requests.service";
import debug from "debug";
import {CreateCoachingRequestDto} from "../dtos/create.coaching.request.dto";

const log: debug.IDebugger = debug('app:coaches-controller');

class CoachingRequestsController {

    async listRequests(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const dto = await requestsService.list(req.aqp);
            res.status(200).send(dto);
        } catch (e){
            next(e);
        }
    }

    async getRequestById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const dto = await requestsService.readById(req.params.reqId);
            res.status(200).send(dto);
        } catch (e){
            next(e);
        }
    }

    async createRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const reqDto: CreateCoachingRequestDto = await requestsService.create(req.body);
            res.status(201).send(reqDto);
        } catch (e){
            next(e);
        }
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const coachingResponseDto = await requestsService.patchById(req.body.id, req.body);
            // TODO
            res.status(204).send();
        } catch (e){
            next(e);
        }
    }

    async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            // req.body will contain the already validated PUT fields under req.body
            await requestsService.putById(req.body.id, req.body);
            res.status(204).send();
        } catch (e){
            next(e);
        }
    }

    async removeRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            await requestsService.deleteById(req.body.id);
            res.status(204).send();
        } catch (e){
            next(e);
        }
    }

    // this functionality can be achieved using query string filtering via GET /requests
    // async getRequestsByCoachId(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         const coachingReqsDto = await requestsService.readByCoachId(req.body.coachId, +req.query.limit!, +req.query.page!, -1);
    //         res.status(200).send(coachingReqsDto);
    //     } catch (e) {
    //         next(e);
    //     }
    // }
}

export default new CoachingRequestsController();