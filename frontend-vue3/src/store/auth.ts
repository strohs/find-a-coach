import {Module} from "vuex";
import logger from "../utils/logger";
import {AuthState, RootState} from "./types";
import {Coach} from "../models/Coach";
import authenticationApi from "../api/AuthenticationApi";
import ApiResult from "../models/ApiResult";


/**
 * The auth module stores information about the currently logged in coach, as well as the coach's current API token
 */
export const auth: Module<AuthState, RootState> = {
    namespaced: true,
    state: {
        isAuthenticated: false,
        // logged in coaches details
        coach: null,
        // coaches API token
        token: '',
        // tokenExpirationTime is stored as the number of milliseconds since the Unix Epoch
        tokenExpirationTime: 0,
    },
    getters: {
        token: (state: AuthState): string => {
            return state.token;
        },
        coach: (state: AuthState): Coach | null => {
            return state.coach;
        },
        isAuthenticated: (state: AuthState): boolean => {
            return state.isAuthenticated;
        },
        tokenExpirationTime: (state: AuthState): number => {
            return state.tokenExpirationTime;
        },
        // returns true if the logged in coach has the "admin" role
        isAdmin: (state: AuthState): boolean => {
            if (state.coach) {
                return state.coach.roles.some(role => role === "admin");
            } else {
                return false;
            }
        },
        // returns true if the logged in user's token has expired
        isTokenExpired: (state: AuthState): boolean => {
            const now = new Date().getTime();
            logger.debug(`isTokenExpired?  now:${now} > expTime:${state.tokenExpirationTime} == ${state.tokenExpirationTime > now}`);
            return now > state.tokenExpirationTime;
        },
    },
    mutations: {
        setToken(state, tok: string) {
            state.token = tok;
        },
        setCoach(state, coach: Coach) {
            state.coach = coach;
        },
        setIsAuthenticated(state, loggedIn: boolean) {
            state.isAuthenticated = loggedIn;
        },
        setTokenExpirationTime(state, expirationTime: number) {
            state.tokenExpirationTime = expirationTime;
        }
    },
    actions: {

        // login a coach. If successful, the coaches data and token are stored in this store, and then the coaches
        // details are returned, wrapped in a ApiResult
        async loginCoach({state, commit}, {email, password}): Promise<ApiResult<Coach>> {
            const res = await authenticationApi.loginCoach(email, password);
            // default token expiration time to 10 minutes if not explicitly configured
            let TOKEN_EXP_TIME_MS: number = 600000;
            if (Number.isInteger(import.meta.env.TOKEN_EXP_TIME_MS)) {
                TOKEN_EXP_TIME_MS = (import.meta.env.TOKEN_EXP_TIME_MS as any) as number;
            }

            logger.debug("login response: ", res);
            if (res.code === 200) {
                logger.debug('loginCoach success', res.data?.coach);

                commit("setCoach", res.data!.coach);
                commit("setIsAuthenticated", true);
                commit("setToken", res.data!.token);
                logger.debug(`auth store token set to ${state.token}`);
                commit("setTokenExpirationTime", new Date().getTime() + (TOKEN_EXP_TIME_MS));
                logger.debug(`auth store expiration time set to ${state.tokenExpirationTime}`);
                return { code: res.code, message: res.message, data: res.data!.coach };
            } else {
                // either the credentials are bad, or some other error has occurred in the backend
                return { code: res.code, message: res.message };
            }
        },

        // logout
        async logout({state, commit}) {
            commit("setIsAuthenticated", false);
            commit("setToken", '');
            commit("setTokenExpirationTime", 0);
            return;
        }

        // refreshToken??
    }
}