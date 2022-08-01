// functions to map database model objects to dto objects

import {ICoachingRequestModel} from "../models/coaching.request.model";
import {CoachingRequestResponseDto} from "./coaching.request.response.dto";

/**
 * builds and returns a CreateCoachingRequestDto from a ICoachingRequestModel.
 * This function essentially maps all own properties (that are not
 * undefined) in ICoachingRequestModel, into the returned Dto
 * @param reqModel - the IReqModel object to copy properties from
 */
export function toCoachingRequestResponseDto(reqModel: ICoachingRequestModel): CoachingRequestResponseDto {
    return {
        ...(reqModel.id && { id: reqModel.id }),
        ...(reqModel.message && { message: reqModel.message }),
        ...(reqModel.fromEmail && { fromEmail: reqModel.fromEmail }),
        ...(reqModel.reply && { reply: reqModel.reply }),
        ...(reqModel.replyAt && { replyAt: reqModel.replyAt }),
        ...(reqModel.coach && {
            coach: {
                id: reqModel.coach.id,
                password: reqModel.coach.password,
                email: reqModel.coach.email,
                firstName: reqModel.coach.firstName,
                lastName: reqModel.coach.lastName,
                hourlyRate: reqModel.coach.hourlyRate,
                description: reqModel.coach.description,
                expertise: reqModel.coach.expertise,
                imageUrl: reqModel.coach.imageUrl,
                createdAt: reqModel.coach.createdAt,
            } }),
        ...(reqModel.createdAt && { createdAt: reqModel.createdAt }),
    }
}