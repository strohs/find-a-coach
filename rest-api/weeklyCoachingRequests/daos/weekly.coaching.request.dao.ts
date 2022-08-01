import debug from "debug";
import {CoachingRequest, ICoachingRequestModel} from "../../coachingRequests/models/coaching.request.model"
import {getWeekOfYear, IWeeklyCoachingRequest, WeeklyCoachingRequest} from "../models/weekly.coaching.request.model";
import dbErrorToApiError from "../../common/errors/dbErrorToApiError";
import {PagedData} from "../../common/interfaces/paged.data";
import {Schema, Types} from "mongoose";

const log: debug.IDebugger = debug('app:weekly-coaching-request-dao');

// adds a coachingRequest to the internal requests array. Creates a new weekly request for the coach if one does
// not already exist
class WeeklyCoachingRequestsDao {

    constructor() {
        log(`WeeklyCoachingRequestsDao created`);
    }

    // add a coaching request to the weeklyCoachingRequests collection. If there was not currently a
    // weeklyCoachingRequest document, one will be created and the coachingRequest will be inserted into it's
    // "requests" array.
    async addCoachingRequest(coachingRequest: ICoachingRequestModel): Promise<number> {
        try {
            log(`addCoachingRequest`, coachingRequest.toObject());
            const updateRes = await WeeklyCoachingRequest.insertCoachingRequest(coachingRequest);
            log(`addCoachingRequest update res`, updateRes);
            return 88;
        }
         catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    // returns a Weekly Coaching requests document for coaching requests that were created during the week specified
    // by date. The date must specify, at a mimimum, the year, month, and day of month, i.e. "2014 04 11" would mean
    // the April 11th, 2014". Note that a week begins on Sunday at 12:01AM and ends on Saturday at midnight.
    async getByCoachIdAndDate(coachId: string, date: Date): Promise<IWeeklyCoachingRequest | null> {
        try {
            log(`getByCoachIdAndDate ${coachId} ${date}`);
            const yearWeek = `${date.getFullYear()}-${getWeekOfYear(date)}`;
            log(`getByCoachIdAndDate yearWeek= ${yearWeek}`);
            const wcr = await WeeklyCoachingRequest.findByCoachIdAndDate(coachId, date);

            if (wcr) {
                log(`getByCoachIdAndDate found WeeklyCoachingRequests ${wcr.id} with ${wcr.requests.length} requests`);
                return wcr;
            } else {
                log(`getByCoachIdAndDate no WeeklyCoachingRequests found for ${coachId} ${yearWeek}`);
                return null;
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }


    /**
     * returns the A WeeklyCoachingRequest document for the specified coachId and using the specified
     * queryParameters. If a document could not be found matching the parameters, null is returned
     * @param coachId
     * @param queryParams
     */
    async getWeeklyRequestsForCoach(coachId: string, queryParams: any): Promise<IWeeklyCoachingRequest | null> {
        try {

            // page comes in as 'skip' query string param
            const page = queryParams.skip || 1;
            const filter = queryParams.filter || {};
            const sort = queryParams.sort || {};
            const limit = queryParams.limit;
            const projection = queryParams.projection || {};
            const skip = (page - 1) * limit;
            filter.coachId = coachId;
            log(`getRequests filter`, filter);
            log(`getRequests skip`, skip);
            log(`getRequests limit`, limit);
            log(`getRequests sort`, sort);
            log(`getRequests projection`, projection);
            log(`getRequests page`, page);

            // we are populating every requests.coach with coach data, may be overkill
            const wcRequests: IWeeklyCoachingRequest | null = await WeeklyCoachingRequest
                .findOne(filter, projection)
                .populate({
                    path: 'requests',
                    populate: { path: 'coach' }
                })
                .skip(skip)
                .limit(limit)
                .sort(sort);

            if (wcRequests) {
                log(`weekly coaching requests retrieved=`, wcRequests);
                return wcRequests
            } else {
                log(`no weekly coaching requests found for filter:`, filter);
                return null;
            }

        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    async getByCoachIdAndYearWeek(coachId: string, year: number, weekOfYear: number): Promise<IWeeklyCoachingRequest | null> {
        try {
            log(`getByCoachIdAndYearWeek ${coachId} ${year} ${weekOfYear}`);
            const yearWeek = `${year}-${weekOfYear}`;
            const wcr = await WeeklyCoachingRequest.findByCoachIdAndYearWeek(coachId, yearWeek);
            if (wcr) {
                log(`getByYearWeekAndCoachId found WeeklyCoachingRequests ${wcr.id} with ${wcr.requests.length} requests`);
                return wcr;
            } else {
                log(`getByYearWeekAndCoachId no WeeklyCoachingRequests found for ${coachId} ${yearWeek}`);
                return null;
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * fetches a WeeklyCoachingRequest by its primary id field
     * @param id primary id of the WeeklyCoachingRequest document
     */
    async getById(id: string): Promise<IWeeklyCoachingRequest | null> {
        try {
            log(`getById ${id}`);
            return await WeeklyCoachingRequest.findById(id);
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * removes the specified coaching request from weekly coaching request collection. The specified coaching request
     * data will be pulled from the coachingRequest collection. This method will NOT delete the request from
     * CoachingRequest, only from WeeklyCoachingRequest
     * @param coachingReqId the id of the **coaching request** document to remove from WeeklyCoachingRequests, this
     * id will be the same as the one stored in CoachingRequests
     */
    async removeCoachingRequest(coachingReqId: string): Promise<number> {
        try {
            log(`removeCoachingRequest ${coachingReqId}`);
            const updateRes = await WeeklyCoachingRequest.deleteByCoachingRequestId(coachingReqId);
            log(`removeCoachingRequest result`, updateRes);
            // todo possible create a return type
            return 88;
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }


    // /**
    //  * attempts to determine if the specified coachingRequest has been inserted into a WeeklyCoachingRequests.requests
    //  * array. If it has, the id of the WeeklyCoachingRequests document containing the request is returned.
    //  * @param coachingRequestId id of the coachingRequest
    //  */
    // private static async weeklyCoachingRequestExists(coachingRequestId: string): Promise<string | null> {
    //     try {
    //         log(`weeklyCoachingRequestExists for coachingRequestId ${coachingRequestId}`);
    //     } catch (e) {
    //         throw dbErrorToApiError(e);
    //     }
    // }
}

export default new WeeklyCoachingRequestsDao();