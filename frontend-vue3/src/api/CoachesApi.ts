import {PagedResult} from "../models/PagedResult";
import {Coach} from "../models/Coach";
import BaseApi from "./BaseApi";
import ApiResult from "../models/ApiResult";
import {AxiosError} from "axios";

/**
 * CoachesApi makes requests to the "/coaches/*"  routes of the REST api.
 * All methods return a Promise<ApiResult<T>> where T will vary depending on the specific API request that
 * was made.
 * Typically "T" will be either a `PagedResult<Coach>` object, or a `Coach` object
 *
 */
class CoachesApi extends BaseApi {

    /**
     * gets a "page" of coaches data, sorted by the coaches "createdAt" date, i.e. newest coaches will be at the front
     * of the array. Callers must remember to check the PagedResult.code property to see if the request succeeded.
     * @param page the page number to retrieve, 1-based indexing
     * @param limit the maximum number of coaches to retrieve
     */
    async getPageOfCoachesSorted(page: number, limit = 10): Promise<ApiResult<PagedResult<Coach>>> {
        try {
            this.logger.debug(`getPageOfCoachesSorted: page=${page} limit=${limit}`);
            const res = await this.axios.get(
                "/coaches", {
                    params: {
                        page,
                        limit,
                        sort: "-createdAt"
                    }
                });
            this.logger.debug(`getPageOfCoachesSorted: ${res.status} page=${page} limit=${limit}`, res);
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
     * makes a request to the REST Api to fetch Coach data using the coaches internal DB id
     * @param coachId - the coaches internal DB id
     */
    async getCoachById(coachId: string): Promise<ApiResult<Coach>> {
        try {
            this.logger.debug(`getCoachById: ${coachId}`);
            const res = await this.axios.get(`/coaches/${coachId}`);
            this.logger.debug(`getCoachById: ${coachId} ${res.status} ${res.data?.message}`);
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
     * calls the REST Api to check if the specified email address is already in use by a coach.
     * The API will return a string body consisting of either "true" or "false".
     * If "true", the email address is in use, "false" means the email is NOT in use
     * @param email - the email to check for existence
     */
    async coachEmailExists(email: string): Promise<ApiResult<boolean>> {
        try {
            this.logger.debug(`coachEmailExists: ${email}`);
            const res = await this.axios.get(`/coaches/email/${email}`);
            this.logger.debug(`coachEmailExists: ${email} ${res.data}`);
            return {
                code: res.status,
                message: res.data?.message,
                data: res.data,
            }
        } catch (error) {
            return this.mapAxiosError(error);
        }
    }

    /**
     * calls the REST Api to fetch a page of coach data that matches the given expertiseStr.
     * The search uses an "OR" search on the expertise. i.e. coaches that have any one of the expertises listed
     * in the expertiseStr will be returned.
     * @param expertiseStr a space separated list of expertise to search for
     * @param page the page number to return, using 1-based indexing, i.e. pass 1 to get the first page of data
     * @param limit the maximum number of coach data to return per page
     */
    async searchCoachExpertiseOr(expertiseStr: string, page = 1, limit = 10): Promise<ApiResult<PagedResult<Coach>>> {
        try {
            const expertise = expertiseStr.trim().replace(' ',',');
            this.logger.debug(`searchCoachExpertiseOr: '${expertise}'`);
            const res = await this.axios.get(`/coaches`,{
                params: {
                    page,
                    limit,
                    sort: "-createdAt",
                    expertise: expertise
                }
            });
            this.logger.debug(`searchCoachExpertiseOr: '${expertise}' ${res.status} returned ${res.data.length} coaches`);
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
     * calls the REST API to register a new coach with find-a-coach
     * @param coach a Coach object containing the coaches registration data
     * @returns a new Coach object containing updated properties as they were saved in the database
     */
    async registerNewCoach(coach: Coach): Promise<ApiResult<Coach>> {
        try {
            this.logger.debug(`registerNewCoach`, coach);
            const res = await this.axios.post('/coaches', coach);
            this.logger.debug(`registerNewCoach API response:`, res);
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
     * calls the REST Api to retrieve coaches that have all the expertise listed in the given expertiseStr.
     *  i.e. it will return only the coaches that have ALL the listed expertise
     * @param expertiseStr - a space separated list of expertise
     * @param page - the page number of Coach data to return, uses 1-based indexing
     * @param limit - the maximum number of coach "objects" to return
     */
    async searchCoachExpertiseAnd(expertiseStr: string, page = 1, limit = 10): Promise<ApiResult<PagedResult<Coach>>> {
        try {
            const expertiseArr: Array<string> = expertiseStr.trim().split(' ');
            // build the filter string used to "AND" the expertise values
            const filterJson = JSON.stringify({
                expertise: {
                    "$all": expertiseArr,
                }
            });
            this.logger.debug(`searchCoachExpertiseAnd: ${filterJson}`);
            const res = await this.axios.get(`/coaches`,{
                params: {
                    page,
                    limit,
                    sort: "-createdAt",
                    filter: filterJson
                }
            });
            this.logger.debug(`searchCoachExpertiseAnd: ${res.status} returned ${res.data.length} coaches`);
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

}

export default new CoachesApi();