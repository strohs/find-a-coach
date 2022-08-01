
import {PagedData} from "../../common/interfaces/paged.data";
import {CoachingRequestResponseDto} from "./coaching.request.response.dto";

export interface ListCoachingRequestsDto extends PagedData<CoachingRequestResponseDto> {
    data: Array<CoachingRequestResponseDto>,
}