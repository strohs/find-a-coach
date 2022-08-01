/**
 * The response that gets sent to user's upon successful OR unsuccessful log-in
 */
import {CreateCoachDto} from "../../coaches/dtos/create.coach.dto";

export interface LoginResponseDto {
    message: string,
    token?: string,
    coach?: CreateCoachDto
}