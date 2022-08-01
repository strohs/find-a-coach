/**
 * CoachingRequestData holds the details for a fetching a page of coaching request data
 * if coachId = '' (empty string), then all requests are fetched
 */
export interface CoachingRequestData {

    // if this is set to a valid coach id, then the API will only fetch requests belonging to that coach
    coachId: string,

    // thw page number to retrieve, 1-based indexing is used
    pageNum: number,

    // limit is the maximum number of coaching requests to retrieve
    limit: number,
}