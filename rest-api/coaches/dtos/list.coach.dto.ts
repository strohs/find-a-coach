import {CreateCoachDto} from "./create.coach.dto";
import {PagedData} from "../../common/interfaces/paged.data";

export interface ListCoachDto extends PagedData<CreateCoachDto>{
    data: Array<CreateCoachDto>,
}