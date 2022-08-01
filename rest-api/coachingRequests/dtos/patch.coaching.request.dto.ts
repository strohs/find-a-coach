// fields that can be patched for a CoachingRequest

export interface PatchCoachingRequestDto {
    fromEmail?: string,
    message?: string,
    reply?: string,
    replyAt?: Date,
}