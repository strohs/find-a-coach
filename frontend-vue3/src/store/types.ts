import {Coach} from "../models/Coach";
import {CoachingRequest} from "../models/CoachingRequest";

export interface RootState {}

export interface CoachState {
    coaches: Array<Coach>,
}

export interface RequestState {
    requests: Array<CoachingRequest>
}


export interface AuthState {
    isAuthenticated: boolean,

    coach: Coach | null,
    // the logged in coach's token for API calls
    token: string,
    // the time the token expires, stored as milliseconds since the Unix Epoch
    tokenExpirationTime: number
}
