// holds coaching request data that can be sent in a http response body

import {ICoachModel} from "../../coaches/models/coach.model";

export interface CoachingRequestResponseDto {
    id?: string;
    message?: string;
    fromEmail?: string;
    coach?: ICoachModel;
    reply: string;
    replyAt?: Date;
    createdAt?: Date;
}

