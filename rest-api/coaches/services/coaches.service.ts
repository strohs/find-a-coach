import {CRUD} from "../../common/interfaces/crud.interface";
import CoachesDao from "../daos/coaches.dao";
import {CreateCoachDto, fromICoachModel} from "../dtos/create.coach.dto";
import {PatchCoachDto} from "../dtos/patch.coach.dto";
import debug from "debug";
import {ListCoachDto} from "../dtos/list.coach.dto";
import {PagedData} from "../../common/interfaces/paged.data";
import {Coach, ICoachModel} from "../models/coach.model";

const log: debug.IDebugger = debug('app:coaches-service');

/**
 * CoachesService is responsible for calling DAO functions, mapping internal DB Models to DTOs and
 * for logging any DB errors that occur.
 * If an error does occur in any of the methods below, an ApiError will be thrown containing a response code within
 * the `ApiCode.code` and a description of the error within `ApiError.message`
 */
class CoachesService implements CRUD {

    /**
     * creates a new coach resource
     * @param resource
     */
    async create(resource: CreateCoachDto): Promise<CreateCoachDto> {
        try {
            log(`create coach`, resource);
            const newCoach = await CoachesDao.addCoach(resource);
            return fromICoachModel(newCoach);
        } catch (e) {
            // either a validation error or non-recoverable db error
            log(e);
            throw e;
        }
    }

    // todo should we also delete a coach's coachingRequests?
    /**
     * deletes a coach by its primary id
     * if the id was found and deleted, returns the original coach data that was deleted. If the id was not found,
     * null is returned.
     *
     * @param id
     */
    async deleteById(id: string): Promise<CreateCoachDto | null> {
        try {
            const deletedCoach = await CoachesDao.removeCoachById(id);
            if (deletedCoach) {
                log(`coach deleted ${id}`);
                return fromICoachModel(deletedCoach);
            } else {
                log(`coach NOT found for deletion ${id}`);
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns a page of coach data according to the specified page number and limit.
     * @param params an query params object from the `api-query-params` package
     */
    async list(queryParams: any): Promise<ListCoachDto> {
        try {
            log(`list params=`, queryParams);
            const coaches: PagedData<ICoachModel> = await CoachesDao.getCoaches(queryParams);
            const resp: Array<CreateCoachDto> = coaches.data.map(c => fromICoachModel(c));
            return {
                ...coaches,
                data: resp,
            };
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * patches specific properties of a coach according to the properties listed in resource.
     * If the id was found and patched successfully, returns the old pre-patched data.
     * If the id was not found, null is returned.
     * @param id
     * @param resource
     * @throws ApiError if some validation error occurred (code=400) or if some DB error occurred (code=500)
     */
    async patchById(id: string, resource: PatchCoachDto): Promise<CreateCoachDto | null> {
        try {
            log(`patchById ${id}  resource:`, resource);
            const oldCoach = await CoachesDao.patchCoachById(id, resource);
            if (oldCoach) {
                return fromICoachModel(oldCoach);
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * Puts a new coach resource over an existing coach resource, using id to find the resource.
     * If the put was successful, the older, pre-put coach document is returned.
     * If the coach was not found, null is returned.
     * @param id
     * @param resource
     * @throws ApiError if some validation error occurred (code=400) or if some DB error occurred (code=500)
     */
    async putById(id: string, resource: CreateCoachDto): Promise<CreateCoachDto | null> {
        try {
            log(`putById ${id}  putDto${resource}`);
            const oldCoach =  await CoachesDao.putCoachById(id, resource);
            if (oldCoach) {
                return fromICoachModel(oldCoach);
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns a single coach resource, if it was found, otherwise null is returned
     * @param id
     */
    async readById(id: string): Promise<CreateCoachDto | null> {
        try {
            log(`readById ${id}`);
            const coach = await CoachesDao.getCoachById(id);
            if (coach) {
                return fromICoachModel(coach);
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns a single coach resource that contains the specified email address. If the resource was not found,
     * null is returned
     * @param email
     */
    async getCoachByEmail(email: string): Promise<CreateCoachDto | null> {
        try {
            log(`getCoachByEmail ${email}`);
            const coach = await CoachesDao.getCoachByEmail(email);
            if (coach) {
                return fromICoachModel(coach);
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * checks if a coach resource contains the specified email.
     * If a coach is found with that email, the coach's ID is returned, else null is returned
     * @param email
     */
    async coachEmailExists(email: string): Promise<string | null> {
        try {
            return await CoachesDao.emailExists(email);
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns true if the specified coach id exists in the DB, else false
     * @param id
     */
    async coachExists(id: string): Promise<boolean> {
        try {
            return CoachesDao.coachExists(id);
        } catch (e) {
            log(e);
            throw e;
        }
    }
}

export default new CoachesService();