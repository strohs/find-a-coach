import {CreateCoachDto} from "../coaches/dtos/create.coach.dto";
import {TokenData} from "../common/interfaces/token.data";
import {CoachingRequestExistDto} from "../coachingRequests/dtos/coaching.request.exist.dto";

/**
 * Here we list any additional types that might be added to express's req object
 */
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {

            // holds coach data
            coach: CreateCoachDto,
            // holds a coachingRequest data
            coachingRequestExistDto: CoachingRequestExistDto,

            // aqp holds the api-query-parameters object
            aqp: any,

            // true if a JWT was sent in the Authorization header and is valid, else false
            isAuth: boolean,

            // stores the JWT string sent in the Authorization header
            authTokenStr?: string,

            // holds the TokenData object stored in the JWT
            authToken?: TokenData
        }
    }
}