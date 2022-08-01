import debug from "debug";
import WeeklyCoachingRequestDao from "../daos/weekly.coaching.request.dao";
import {WeeklyCoachingRequestDto} from "../dtos/weekly.coaching.request.dto";
import {toWeeklyCoachingRequestDto} from "../dtos/dto.mapper";
import {ICoachingRequestModel} from "../../coachingRequests/models/coaching.request.model";
import {CoachingRequestResponseDto} from "../../coachingRequests/dtos/coaching.request.response.dto";

const log: debug.IDebugger = debug('app:weekly-coaching-requests-service');

/**
 * This service allows querying the WeeklyRequestsService collection, but does not allow updates and deletes.
 * Those are kept in sync via the CoachingRequestDao
 */
class WeeklyCoachingRequestsService {

    constructor() {
        log(`WeeklyCoachingRequestService created`);
    }

    async getWeeklyRequestsForCoach(coachId: string, queryParams: any): Promise<WeeklyCoachingRequestDto | null> {
        try {
            log(`getWeeklyRequestsForCoach for coachIUd=${coachId} with queryParams`, queryParams);

            const wcr = await WeeklyCoachingRequestDao.getWeeklyRequestsForCoach(coachId, queryParams);
            if (wcr) {
                return toWeeklyCoachingRequestDto(wcr);
            } else {
                // no weekly requests were found
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    // get a WeeklyCoachingRequest data by its primary id
    async readById(id: string): Promise<WeeklyCoachingRequestDto | null> {
        try {
            log(`getWeeklyRequest id=${id}`);
            const wcr = await WeeklyCoachingRequestDao.getById(id);
            if (wcr) {
                return toWeeklyCoachingRequestDto(wcr);
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    // async patchCoachingRequestReply(coachingRequest: CoachingRequestResponseDto): Promise<WeeklyCoachingRequestDto | null> {
    //     try {
    //         log(`patchCoachingRequestReply coachingRequest=${coachingRequest}`);
    //         const wcr = await WeeklyCoachingRequestDao.patchCoachingRequest();
    //         if (wcr) {
    //             return toWeeklyCoachingRequestDto(wcr);
    //         } else {
    //             return null;
    //         }
    //     } catch (e) {
    //         log(e);
    //         throw e;
    //     }
    // }

}

export default new WeeklyCoachingRequestsService();