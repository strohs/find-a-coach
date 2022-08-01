import express from 'express';

import coachesService from '../services/coaches.service';
import debug from "debug";

const log: debug.IDebugger = debug('app:coaches-controller');

/**
 * Singleton controller for the Coach resource.
 */
class CoachesController {


    async listCoaches(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`listCoaches`)
            const dto = await coachesService.list(req.aqp);
            res.status(200).send(dto);
        } catch (e){
            next(e);
        }
    }

    async getCoachById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`getCoachById ${req.body.id}`);
            const dto = await coachesService.readById(req.body.id);
            res.status(200).send(dto);
        } catch (e){
            next(e);
        }
    }

    async createCoach(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`createCoach`);
            const newCoachDto = await coachesService.create(req.body);
            res.status(201).send(newCoachDto);
        } catch (e){
            next(e);
        }
    }

    async coachEmailExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`coachEmailExists`, req.params.email);
            const coachId: string | null = await coachesService.coachEmailExists(req.params.email);
            log(`coachEmailExists result for: ${req.params.email} = ${coachId}`);
            if (coachId) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }
        } catch (e) {
            next(e);
        }
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`patchCoach`);
            await coachesService.patchById(req.body.id, req.body);
            res.status(204).send({message: 'OK'});
        } catch (e){
            next(e);
        }
    }

    async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`putCoach`);
            await coachesService.putById(req.body.id, req.body);
            res.status(204).send();
        } catch (e){
            next(e);
        }
    }

    async removeCoach(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`removeCoach ${req.body.id}`);
            await coachesService.deleteById(req.body.id);
            res.status(204).send();
        } catch (e){
            next(e);
        }
    }
}

export default new CoachesController();