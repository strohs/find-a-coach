import {Coach} from "./Coach";

/**
 * Holds the properties returned by a call to logging in a coach
 */
export interface LoginResult {
    // holds the jwt string, if the login request was successful
    token?: string,
    // logged in coach data
    coach?: Coach,
}