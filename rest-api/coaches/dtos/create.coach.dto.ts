import {ICoachModel} from "../models/coach.model";

export interface CreateCoachDto {
    id?: string,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    hourlyRate?: number,
    description?: string,
    expertise?: string[],
    roles?: string[],
    imageUrl?: string,
    createdAt?: Date,
}

/**
 * returns a CreateCoachDto given an ICoachModel
 * @param model {ICoachModel} the model object to convert to a CreateCoachDto
 */
export function fromICoachModel(model: ICoachModel): CreateCoachDto {
    return {
        ...(model.id && { id: model.id }),
        ...(model.email && { email: model.email }),
        ...(model.password && { password: model.password }),
        ...(model.firstName && { firstName: model.firstName }),
        ...(model.lastName && { lastName: model.lastName }),
        ...(model.hourlyRate && { hourlyRate: model.hourlyRate }),
        ...(model.description && { description: model.description }),
        ...(model.expertise && { expertise: model.expertise }),
        ...(model.roles && { roles: model.roles }),
        ...(model.imageUrl && { imageUrl: model.imageUrl }),
        ...(model.createdAt && { createdAt: model.createdAt }),
    }
}