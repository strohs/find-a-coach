import {Coach, buildCoach} from "./Coach";

/**
 * CoachingRequest holds the details of a "coaching request" from a student to a coach
 */
export interface CoachingRequest {
    id: string,
    coach: Coach,
    message: string,
    fromEmail: string,
    reply?: string,
    replyAt?: Date,
    createdAt: Date,
}

/**
 * A builder that can be used to build and return a CoachingRequest
 * @param id - database ID of the coach
 * @param coach - a Coach object
 * @param message - the actuak text of the coaching request
 * @param fromEmail - the student's email address
 * @param reply - the coaches reply to the student
 * @param replyAt - the date the reply was sent
 * @param createdAt - a JavaScript Date object indicating when this request was created, it defaults to now
 */
export function builder(
    id = "-1",
    coach = buildCoach(),
    message = "",
    fromEmail = "",
    reply = "",
    replyAt = undefined,
    createdAt = new Date()
): CoachingRequest
{
    return { id, coach, message, fromEmail, reply, replyAt, createdAt };
}