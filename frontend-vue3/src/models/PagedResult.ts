
export interface PagedResult<T> {
    // the requested page number, 1-based
    page?: number,
    // the number of objects requested
    limit?: number,
    // the actual length of the data Array
    length?: number,
    // an array of objects
    data?: Array<T>,
}