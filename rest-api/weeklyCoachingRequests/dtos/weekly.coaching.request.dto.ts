import {
    CreateCoachingRequestDto
} from "../../coachingRequests/dtos/create.coaching.request.dto";

export interface WeeklyCoachingRequestDto {
    id?: string;
    coachId?: string;
    yearWeek?: string;
    requests?: Array<CreateCoachingRequestDto>,
    createdAt?: Date;
}

