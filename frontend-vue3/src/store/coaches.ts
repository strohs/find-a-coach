import {Module} from "vuex";
import {CoachState, RootState} from "./types";
import {generateId} from "../utils/random";
import {Coach} from "../models/Coach";
import coachesApi from "../api/CoachesApi";
import ApiResult from "../models/ApiResult";
import {PagedResult} from "../models/PagedResult";
import logger from "../utils/logger";


export const coach: Module<CoachState, RootState> = {
    namespaced: true,
    state: {
        coaches: [],
    },
    getters: {
        getAllCoaches: (state) => {
            return state.coaches;
        },
        getCoachById: (state) => (id: string): Coach | null => {
            const coach: Coach | undefined = state.coaches.find(c => c.id === id);
            return coach || null;
        },
        // the total amount of coaches currently being stored in the state array
        getTotalCoaches: (state) => {
            return state.coaches.length;
        },

        // get a "page" of coaches from the state's coaches array. If the pageNum exceeds the current length of the coaches
        // array, an empty array will be returned
        // pageNum - is a 1-based page number, i.e. page 1 = first page of data
        getPageOfCoaches: (state) => (pageNum: number, pageSize: number) => {
            const startIdx = pageNum < 1 ? 0 : (pageNum - 1) * pageSize;
            const endIdx = startIdx + pageSize;
            logger.debug(`coach.getPageOfCoaches ${startIdx} to ${endIdx}`)
            return state.coaches.slice(startIdx, endIdx);
        },
    },
    mutations: {
        addCoach(state, coach: Coach) {
            state.coaches.push(coach);
        },
        setAllCoaches(state, coaches: Array<Coach>) {
            state.coaches = [];
            for (const coach of coaches) {
                state.coaches.push(coach);
            }
        },
    },
    actions: {

        /// get a specific page of coaches from the API
        // page = 1-based page number to begin at
        // limit = the total number of coaches to return
        async fetchCoachesPage({commit}, { page, limit }): Promise<ApiResult<PagedResult<Coach>>> {
            const res = await coachesApi.getPageOfCoachesSorted(page, limit);
            if (res.code === 200) {
                commit('setAllCoaches', res.data!.data);
            }
            return res;
        },

        // calls the api to register a new coach
        async registerCoach({commit}, coach: Coach) {
            const res: ApiResult<Coach> = await coachesApi.registerNewCoach(coach);
            if (res.code === 201) {
                commit('addCoach' , res.data);
            }
            return res;
        },

        // fetches coach details for the specified coachId
        async getCoach({commit}, coachId: string): Promise<ApiResult<Coach>> {
            const res = await coachesApi.getCoachById(coachId);
            return res;
        },

        async searchExpertiseByOr({commit, state}, { searchTerm, page, limit }): Promise<ApiResult<PagedResult<Coach>>> {
            logger.debug(`searchExpertiseByOr "${searchTerm}"`);
            const res = await coachesApi.searchCoachExpertiseOr(searchTerm, page, limit);
            if (res.code === 200) {
                commit('setAllCoaches', res.data!.data);
            }
            return res;

        }

    }
};

