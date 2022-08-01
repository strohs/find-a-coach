import {CreateCoachingRequestDto} from "../dtos/create.coaching.request.dto";
import {PatchCoachingRequestDto} from "../dtos/patch.coaching.request.dto";
import {ICoachingRequestModel, CoachingRequest} from "../models/coaching.request.model";
import debug from "debug";
import {Coach} from "../../coaches/models/coach.model";
import ApiError from "../../common/errors/ApiError";
import {PagedData} from "../../common/interfaces/paged.data";
import coachesDao from "../../coaches/daos/coaches.dao";
import dbErrorToApiError from "../../common/errors/dbErrorToApiError";
import {CoachingRequestExistDto} from "../dtos/coaching.request.exist.dto";
import {WeeklyCoachingRequest} from "../../weeklyCoachingRequests/models/weekly.coaching.request.model";

const log: debug.IDebugger = debug('app:coaching-requests-dao');

/**
 * CoachingRequests Dao performs CRUD ops against the CoachingRequests collection.
 * It also maps DB errors to ApiErrors when needed.
 * All methods in this class could throw an ApiError if there are validation errors or other unexpected DB errors.
 * Should this happen, ApiError.code will be set to a corresponding HTTP code whenever possible:
 *  - 400 when a validation error occurs
 *  - 500 when some other, unexpected DB error occurs.
 */
class CoachingRequestsDao {

    constructor() {
        log(`CoachingRequestsDao created`);
    }

    /**
     * creates a coaching request for the coach specified in request.coachId
     * @param request
     * @throws ApiError if the coachId was not found, a 404 ApiError is thrown. If another DBError occurs, a 500
     * ApiError is thrown
     */
    async createRequest(request: CreateCoachingRequestDto): Promise<ICoachingRequestModel> {
        try {
            const coachDocument = await Coach.findById(request.coachId);
            if (coachDocument) {
                const newRequest = new CoachingRequest({...request});
                newRequest.coach = coachDocument;
                const savedRequest = await newRequest.save();
                log(`created new request`, savedRequest);
                return savedRequest;
            } else {
                throw new ApiError(404, `coachId ${request.coachId} not found`);
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * returns a PageData object whose data property will contain a page of coaching requests. If no data was found,
     * an empty list will be returned.
     * @param queryParams - queryParams object from api-query-params package
     */
    async getRequests(queryParams: any): Promise<PagedData<ICoachingRequestModel>> {
        try {
            // page comes in as the 'skip' query string param
            const page = queryParams.skip || 1;
            const filter = queryParams.filter || {};
            const sort = queryParams.sort || {};
            const limit = queryParams.limit;
            const projection = queryParams.projection || {};
            const skip = (page - 1) * limit;

            log(`getRequests filter`, filter);
            log(`getRequests skip`, skip);
            log(`getRequests limit`, limit);
            log(`getRequests sort`, sort);
            log(`getRequests projection`, projection);
            log(`getRequests page`, page);

            const requests: Array<ICoachingRequestModel> = await CoachingRequest
                .find(filter, projection)
                .populate('coach')
                .skip(skip)
                .limit(limit)
                .sort(sort);

            log(`coachingRequests retrieved= ${requests.length}`);

            return {
                page,
                limit,
                length: requests.length,
                data: requests,
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * returns a specific request by its id, or null if the request was not found.
     * @param reqId
     */
    async getRequestById(reqId: string): Promise<ICoachingRequestModel | null> {
        try {
            return await CoachingRequest
                .findById(reqId)
                .populate('coach');
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * Puts a new CoachingRequest document over an existing one.
     * Returns the old, pre-put document, if the put was successful. If the requestId or the coachId don't exist,
     * an ApiError is thrown with 404 code
     * @param reqId
     * @param request
     */
    async putRequestById(reqId: string, request: CreateCoachingRequestDto): Promise<ICoachingRequestModel> {
        try {
            const reqDocument: ICoachingRequestModel | null = await CoachingRequest.findById(reqId);
            if (reqDocument) {
                // get coach document
                const coachDocument = await Coach.findById(request.coachId);
                if (coachDocument) {
                    reqDocument.fromEmail = request.fromEmail ? request.fromEmail : reqDocument.fromEmail;
                    reqDocument.message = request.message ? request.message : reqDocument.message;
                    reqDocument.reply = request.reply ? request.reply : reqDocument.reply;
                    reqDocument.replyAt = request.replyAt ? request.replyAt : reqDocument.replyAt;
                    reqDocument.coach = coachDocument;
                    const savedReqDocument = await reqDocument.save();
                    log(`putRequestById: ${reqId} saved`, savedReqDocument);
                    // update weekly coaching requests with any updated Coaching request data
                    await WeeklyCoachingRequest.updateCoachingRequest(savedReqDocument);

                    return savedReqDocument;
                } else {
                    throw new ApiError(404, `coachId ${request.coachId} does not exist`);
                }
            } else {
                throw new ApiError(404, `request id ${reqId} not found`);
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * Patches individual properties of a CoachingRequest as listed in the passed in request object.
     * Returns the old, pre-patch document if the Patch was successful, otherwise throws a ApiError with 404 code
     * @param reqId
     * @param request
     */
    async patchRequestById(reqId: string, request: PatchCoachingRequestDto): Promise<ICoachingRequestModel> {
        try {
            const patchedRequest = await CoachingRequest.findByIdAndUpdate(
                reqId,
                {...request},
                { runValidators: true, returnDocument: 'after' });
            if (patchedRequest) {
                // update weekly coaching requests with the patched coaching request
                log("returned patchedRequest ", patchedRequest);
                const wcr = await WeeklyCoachingRequest.updateCoachingRequest(patchedRequest);
                log('patched weekly coaching request: ', wcr);
                return patchedRequest;
            } else {
                throw new ApiError(404, `request id ${reqId} not found`);
            }
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }

    /**
     * removes a CoachingRequest document from the DB.
     * If the delete was successful, the deleted document is returned. If the document was not found, null is returned.
     * @param reqId
     */
    async removeRequestById(reqId: string): Promise<ICoachingRequestModel | null> {
        try {
            return await CoachingRequest.findByIdAndDelete(reqId);
        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }


    // async getRequestsByCoachId(coachId: string, limit: number, page: number, sort: number): Promise<PagedData> {
    //     try {
    //         const coachOid = new mongoose.Types.ObjectId(coachId);
    //         // @ts-ignore
    //         const totalRequests = await CoachingRequest.countDocuments({ coachId: coachOid });
    //         const totalPages = Math.round(totalRequests / limit);
    //         const skip = (page - 1) * limit;
    //
    //         // @ts-ignore
    //         const requests: Array<ICoachingRequestModel> = await CoachingRequest.find({ coachId: coachOid })
    //             .sort({ createdAt: -1 })
    //             .skip(skip)
    //             .limit(limit);
    //         log(`getRequestsByCoachId ${coachId} limit=${limit} page=${page} sort=${sort} totalRequests=${totalRequests} length=${requests.length}`);
    //
    //         return {
    //             page,
    //             limit: totalPages,
    //             length: requests.length,
    //             data: requests,
    //         }
    //     } catch (e) {
    //         throw dbErrorToApiError(e);
    //     }
    // }

    /**
     * performs a lean query to determine if a coaching request exists.
     * Returns a CoachingRequestExistDto if the request exists, otherwise returns null
     * @param id
     */
    async requestExists(id: string): Promise<CoachingRequestExistDto | null> {
        try {
            const request = await CoachingRequest
                .findById(id, { _id: 1, coach: 1 })
                .lean();

            log(`requestExists ${id}`, request);

            if (request) {
                return {
                    id: request._id,
                    coachId: request.coach.toString()
                }
            } else {
                return null;
            }

        } catch (e) {
            throw dbErrorToApiError(e);
        }
    }
}

export default new CoachingRequestsDao();