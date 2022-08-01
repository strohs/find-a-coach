/**
 * All the possible interface types that could be returned in a request for a "coaches" resource
 */
import {CreateCoachDto} from "./create.coach.dto";
import {PatchCoachDto} from "./patch.coach.dto";
import {ListCoachDto} from "./list.coach.dto";


export type CoachResponseDto =
    CreateCoachDto |
    PatchCoachDto |
    ListCoachDto;