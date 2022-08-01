import {CreateCoachDto, fromICoachModel} from "../dtos/create.coach.dto";
import {PatchCoachDto} from "../dtos/patch.coach.dto";
import {Coach, ICoachModel} from "../models/coach.model";
import debug from "debug";
import {PagedData} from "../../common/interfaces/paged.data";
import dbErrorToApiError from "../../common/errors/dbErrorToApiError";

const log: debug.IDebugger = debug('app:coaches-dao');

// maybetodo maybe rename to mongooseDao and make another abstract DAO class

/**
 * CoachesDao contains methods to manipulate the coaches collection. It is responsible for retrieving data
 * and transforming it into an ICoachModel object. Additionally, it will try to map any Errors thrown by the
 * database, or the database driver, into a more general ApiError object.
 * Methods that retrieve data will return either an ICoachModel, PagedData or null. If null is returned, then the data
 * was not found for whatever criteria was used to find the data (i.e. like an 'id').
 *
 * If the database (or driver) threw an error, this class will attempt to map it into an ApiError and set the
 * ApiError.code property accordingly:
 * 400 = a validation or casting error occurred when trying to save data. The ApiError.message will contain a
 *       description of the problem
 * 500 = some other (possibly unrecoverable) database error occurred, that could not be mapped. ApiError.debugMessage
 *       will contain a description of the error as received from the driver
 */
class CoachesDao {

    constructor() {
        log('CoachesDao created');
    }

    /**
     * create a new coach document in the DB
     * @param coach
     */
    async addCoach(coach: CreateCoachDto): Promise<ICoachModel> {
        try {
            const newCoach = new Coach({...coach});
            const savedCoach = await newCoach.save();
            return savedCoach;
        } catch (e) {
            throw dbErrorToApiError(e);
        }

    }

    /**
     * returns a PageData object whose .data property will contain the requested data if it was found. If it was not
     * found, the .data property will contain an empty array
     * @param queryParams - queryParams object from api-query-params package
     */
    async getCoaches(queryParams: any): Promise<PagedData<ICoachModel>> {
        try {
            // page comes in as 'skip' query string param
            const page = queryParams.skip || 1;
            const filter = queryParams.filter || {};
            const sort = queryParams.sort || {};
            const limit = queryParams.limit;
            const projection = queryParams.projection || {};
            const skip = (page - 1) * limit;
            log(`getCoaches filter`, filter);
            log(`getCoaches skip`, skip);
            log(`getCoaches limit`, limit);
            log(`getCoaches sort`, sort);
            log(`getCoaches projection`, projection);

            const coaches: Array<ICoachModel> = await Coach
                .find(filter, projection)
                .skip(skip)
                .limit(limit)
                .sort(sort);

            log(`coaches retrieved=`, coaches.length);
            return {
                page,
                limit,
                length: coaches.length,
                data: coaches,
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * returns a single ICoachModel for the specified coachId, or null if it was not found or does not exist
     * @param coachId
     */
    async getCoachById(coachId: string): Promise<ICoachModel | null> {
        try {
            log(`getCoachById: ${coachId}`);
            return await Coach.findById(coachId);
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * puts a new coach document over an existing coach document. If the coachId was not found, null is returned
     * @param coachId
     * @param coach - the coach properties to replace
     */
    async putCoachById(coachId: string, coach: CreateCoachDto): Promise<ICoachModel | null> {
        try {
            log(`putCoachById ${coachId}`, coach);
            return await Coach.findByIdAndUpdate(coachId, {...coach}, { runValidators: true });
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }


    /**
     * patches individual fields of a coach document. If the coachId was not found, null is returned. If the coach was
     * found, the original, pre-patched coach model is returned
     * @param coachId
     * @param coach - the coach properties to patch
     */
    async patchCoachById(coachId: string, coach: PatchCoachDto): Promise<ICoachModel | null> {
        try {
            log(`patchedCoachById: ${coachId}`);
            return await Coach.findByIdAndUpdate(coachId, {...coach}, {runValidators: true});
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * attempts to delete the specified coach. If the coachId was not found, null is returned. If the coach was found,
     * the old coach model is returned
     * @param coachId
     */
    async removeCoachById(coachId: string): Promise<ICoachModel | null> {
        try {
            log(`removeCoachById ${coachId}`);
            return await Coach.findByIdAndDelete(coachId);
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * returns a single coach model that contains the specified email address. If the email was not found, null is
     * returned
     * @param email
     */
    async getCoachByEmail(email: string): Promise<ICoachModel | null> {
        try {
            log(`getCoachByEmail ${email}`);
            return await Coach
                .findOne({ email: email });
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * if the specified email exists, returns the id string of the coach that owns it, else null is returned.
     * This method performs a lean() query and only projects the _id fields, which should hopefully improve performance
     * @param email
     */
    async emailExists(email: string): Promise<string | null> {
        try {
            log(`hasEmail ${email}`);
            const coach = await Coach
                .findOne({ email: email }, { _id: 1 })
                .lean();

            if (coach) {
                return coach._id.toHexString();
            } else {
                return null;
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * checks if a coach exists using the id to lookup
     * @param id
     */
    async coachExists(id: string): Promise<boolean> {
        try {
            const coach = await Coach
                .findById(id, { _id: 1 })
                .lean();
            log(`coachExists ${id} ${!!coach}`);
            return !!coach;
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }
}

export default new CoachesDao();
