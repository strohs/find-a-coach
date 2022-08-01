import BaseApi from "./BaseApi";
import logger from "../utils/logger";
import ApiResult from "../models/ApiResult";
import {CoachingRequest} from "../models/CoachingRequest";
import {PagedResult} from "../models/PagedResult";
import {AxiosError} from "axios";

/**
 * This class handles making requests to the "/requests/*" routes of the REST Api
 * All methods return a Promise<ApiResult<T>> where T will vary depending on the specific API request that
 * was made. Typically, a PagedResult<CoachingRequest> object will be returned
 */
class CoachingRequestsApi extends BaseApi {
    constructor() {
        super();
    }

    /**
     * fetches a page of coaching request data from the API. The requests will be returned sorted by createdAt date
     * descending. Callers of this method will need to check the code property to see if the request succeeded. A code
     * = 200 is a successful request, while a code >= 400 and <= 500 indicates the request failed, in which case
     * the message property should contain a description of the error
     * @param coachId - the DB id of the coach to retrieve requests for
     * @param page
     * @param limit
     * @param authToken
     */
    async getPageOfRequestsForCoachSorted(coachId: string, page: number, limit: number, authToken: string): Promise<ApiResult<PagedResult<CoachingRequest>>> {
        try {
            logger.debug(`getPageOfCoachingRequestsSorted ${coachId} page ${page} limit ${limit} token ${authToken}`);
            const res = await this.axios.get(
                "/requests", {
                    params: {
                        coachId,
                        page,
                        limit,
                        sort: "-createdAt"
                    },
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            logger.debug(`getPageOfCoachingRequestsSorted ${res.status} got ${res.data?.length} coaching requests`)
            return {
                code: res.status,
                message: res.data?.message,
                data: {
                    page: res.data.page,
                    limit: res.data.limit,
                    length: res.data.length,
                    data: res.data.data,
                }
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }

    /**
     * Fetches a page of coaching request data for all coaches in the DB.
     * The data will be sorted by the createdAt date
     * @param page - 1-based index of page of data to fetch
     * @param limit - maximum number of coaching requests to fetch
     * @param authToken - the JWT of the currently logged in coach (or admin) to use when making the request
     */
    async getPageOfRequestsForAllCoachesSorted(page: number, limit: number, authToken: string): Promise<ApiResult<PagedResult<CoachingRequest>>> {
        try {
            logger.debug(`getPageOfRequestsForAllCoachesSorted page ${page} limit ${limit}`);
            const res = await this.axios.get(
                "/requests", {
                    params: {
                        page,
                        limit,
                        sort: "-createdAt"
                    },
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            logger.debug(`getPageOfRequestsForAllCoachesSorted ${res.status} got ${res.data?.length} coaching requests`);
            return {
                code: res.status,
                message: res.data?.message,
                data: {
                    page: res.data.page,
                    limit: res.data.limit,
                    length: res.data.length,
                    data: res.data.data,
                }
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }

    /**
     * creates a new coaching request for the coach id specified in: request.coach.id. All other properties in
     * request.coach will be ignored.
     * returns a new CoachingRequest object containing the coachingRequest data as created in the DB
     * @param request {CoachingRequest}
     */
    async createCoachingRequest(request: CoachingRequest): Promise<ApiResult<CoachingRequest>> {
        try {
            logger.debug(`createCoachingRequest`, request);
            const res = await this.axios.post('/requests', {
                fromEmail: request.fromEmail,
                message: request.message,
                coachId: request.coach.id,
            });
            this.logger.debug(`createCoachingRequest returned`, res);

            return {
                code: res.status,
                message: res.data?.message,
                data: res.data.data,
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }

    /**
     * calls the REST Api to get a single CoachingRequest
     * @param id - the internal DB id of the CoachingRequest to retrieve
     */
    async getRequestById(id: string): Promise<ApiResult<CoachingRequest>> {
        try {
            this.logger.debug(`getRequestById: ${id}`);
            // todo set authToken?
            const res = await this.axios.get(`/requests/${id}`);
            this.logger.debug(`getRequestsById: ${id} ${res.status} ${res.data?.message}`);
            return {
                code: res.status,
                message: res.data?.message,
                data: res.data?.data,
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }

    /**
     * calls the REST Api to delete a specific coachingRequest.
     * Only coaches that own the CoachingRequest can delete their own requests.
     * Returns:
     *  - ApiResult.code = 204 if the delete was successful
     *  - ApiResult.code = 401 if the authToken is invalid
     * @param id - internal DB id of the CoachingRequest to delete
     * @param authToken - the JWT of the coach (or admin) making the delete request
     */
    async deleteRequestById(id: string, authToken: string): Promise<ApiResult<any>> {
        try {
            this.logger.debug(`deleteRequestById: ${id}`);

            const res = await this.axios.delete(
                `/requests/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            this.logger.debug(`deleteRequestsById: ${id} ${res.status} ${res.data?.message}`);
            return {
                code: res.status,
                message: res.data?.message,
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }

    /**
     * calls the REST Api to set a reply to a coaching request
     * @param id - the internal ID of the coaching request to reply to
     * @param reply - the text of the reply
     * @param authToken - the JWT string of the coach (or admin) making the reply
     */
    async replyToCoachingRequest(id: string, reply: string, authToken: string): Promise<ApiResult<any>> {
        try {
            this.logger.debug(`replyToCoachingRequest: ${id}`);
            const res = await this.axios.patch(
                `/requests/${id}`, {
                    reply: reply,
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            this.logger.debug(`replyToCoachingRequest: ${id} ${res.status}`);
            return {
                code: res.status,
                message: res.data?.message,
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }
}

export default new CoachingRequestsApi();