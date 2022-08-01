export interface CoachingRequestExistDto {
    // the db id of the coaching request
    id: string;
    // the db id of the coach that owns the request
    coachId: string;
}