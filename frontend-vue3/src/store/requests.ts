import { RequestState, RootState } from "./types";
import { Module } from "vuex";
import { CoachingRequest } from "../models/CoachingRequest";
//import { generateId } from "../utils/random";
import { CoachingRequestData } from "../models/CoachingRequestData";
import {PagedResult} from "../models/PagedResult";
import ApiResult from "../models/ApiResult";
import CoachingRequestsApi from "../api/CoachingRequestsApi";
import logger from "../utils/logger";

/**
 * The requests store holds all coaching request data for the currently logged in coach
 *
 */
export const request: Module<RequestState, RootState> = {
    namespaced: true,
    state: {
        requests: [],
    },
    getters: {
        /**
         * returns a request using its id field to look it up in the store
         * @param state
         */
        getRequestById: (state: RequestState) => (requestId: string): CoachingRequest | undefined => {
            return state.requests.find(req => req.id === requestId);
        },

        /**
         * returns the current number of coaching requests in the store
         * @param state
         */
        getTotalRequests: (state: RequestState): number => {
            return state.requests.length;
        },

        /**
         * returns a shallow copy of coaching request data, in a new Array, beginning at startIdx and ending at
         * endIdx (exclusive)
         * @param state
         */
        getSliceOfRequests: (state: RequestState) => (startIdx: number, endIdx: number): Array<CoachingRequest> => {
            logger.debug(`getSliceOfRequests ${startIdx} to ${endIdx}`);
            return state.requests.slice(startIdx, endIdx);
        }
    },

    mutations: {
        // set all requests to a new Array of requests
        setAllRequests(state: RequestState, requests: Array<CoachingRequest>) {
            state.requests = [];
            for (const req of requests) {
                state.requests.push(req);
            }
        },

        // add a new coaching request to this store
        setRequest(state: RequestState, request: CoachingRequest) {
            state.requests.push(request);
        },

        // remove a coaching request from the store's requests array
        deleteRequestById(state: RequestState, requestId: string) {
            const reqIndex = state.requests.findIndex( req => req.id === requestId);
            if (reqIndex > -1) {
                logger.debug(`deleting request ${requestId} at index ${reqIndex} from store`);
                state.requests.splice(reqIndex, 1);
            }
        }
    },

    actions: {

        /**
         * creates a new coaching request by calling the REST Api.
         * request.coach.id must contain the id of the coach to receive the request
         * Returns a new CoachingRequest object containing updated data from the DB
          */
        async createRequest({commit}, request: CoachingRequest): Promise<ApiResult<CoachingRequest>> {
            const res = await CoachingRequestsApi.createCoachingRequest(request);
            return res;
        },

        /**
         * fetches a page of coaching requests from the REST Api, for the coachId specified in the pageData object.
         * If the API returns a 200 code, the coaching request data will be saved in this store
         * returns the coachingRequest data wrapped in a PagedResult object
         * @param pageData.coachId - the coaches database ID
         *        pageData.pageNum - the page of data to return
         *        pageData.limit - the maximum number of coaching request to return
         */
        async fetchRequestsForCoach({state, commit, rootGetters}, pageData: CoachingRequestData): Promise<ApiResult<PagedResult<CoachingRequest>>> {
            const res = await CoachingRequestsApi.getPageOfRequestsForCoachSorted(
                pageData.coachId,
                pageData.pageNum,
                pageData.limit,
                rootGetters['auth/token'],
                );

            if (res.code === 200) {
                commit('setAllRequests', res.data!.data);
            }

            return res;
        },

        /**
         * fetches a page worth of all coaching requests from the REST Api. The pageNum and limit is set in the
         * pageData object. If the request was successful, the coaching request data will be set in this store.
         * returns CoachingRequest data wrapped in a PageResult object
         * @param pageData
         */
        async fetchAllRequests({state, commit, rootGetters}, pageData: CoachingRequestData): Promise<ApiResult<PagedResult<CoachingRequest>>> {
            const res = await CoachingRequestsApi.getPageOfRequestsForAllCoachesSorted(
                pageData.pageNum,
                pageData.limit,
                rootGetters['auth/token'],
            );

            if (res.code === 200) {
                commit('setAllRequests', res.data!.data!);
            }

            return res;
        },

        /**
         * deletes the specified coaching request via a call to the REST Api.
         * If the request was successful, the ApiResult.code will = 204
         *
         * @param requestId - the database ID of the coachingRequest to delete
         */
        async deleteRequest({state, commit, rootGetters}, requestId: string): Promise<ApiResult<any>> {
            const res: ApiResult<any> = await CoachingRequestsApi.deleteRequestById(requestId, rootGetters['auth/token']);
            if (res.code === 200 || res.code === 204) {
                commit('deleteRequestById', requestId);
            }
            return res;
        },


        async replyToRequest({state, commit, getters, rootGetters}, coachingRequest: CoachingRequest): Promise<ApiResult<any>> {
            const res: ApiResult<any> = await CoachingRequestsApi.replyToCoachingRequest(
                coachingRequest.id,
                coachingRequest.reply!,
                rootGetters['auth/token']
            );

            if (res.code === 200 || res.code === 204) {
                coachingRequest.replyAt = new Date();
            }

            return res;
        }

    }
}