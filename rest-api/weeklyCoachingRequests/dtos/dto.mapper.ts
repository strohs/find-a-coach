import {IWeeklyCoachingRequest} from "../models/weekly.coaching.request.model";
import {CreateCoachingRequestDto} from "../../coachingRequests/dtos/create.coaching.request.dto";
import {toCoachingRequestResponseDto} from "../../coachingRequests/dtos/dto.mapper";
import {WeeklyCoachingRequestDto} from "./weekly.coaching.request.dto";

/**
 * builds a CreateWeeklyCoachingRequestDto from a IWeeklyCoachingRequestModel, essentially maps all own properties
 * from the reqModel to the returned dto
 * @param wcr - the IWeeklyRequestModel object to copy properties from
 */
export function toWeeklyCoachingRequestDto(wcr: IWeeklyCoachingRequest): WeeklyCoachingRequestDto {
    // map individual ICoachingRequests to CreateCoachingRequests
    const requests: Array<CreateCoachingRequestDto> = wcr.requests.map(r => toCoachingRequestResponseDto(r));

    return {
        ...(wcr.id && { id: wcr.id }),
        ...(wcr.yearWeek && { yearWeek: wcr.yearWeek }),
        ...(wcr.coachId && { coachId: wcr.coachId.toHexString() }),
        ...(wcr.createdAt && { createdAt: wcr.createdAt }),
        requests: requests,
    }
}