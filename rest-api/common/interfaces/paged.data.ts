/**
 * PagedData is the base interface for paged data returned from a database
 *
 * page - is the requested page of data
 * limit - is the limit number that was requested
 * length - is the length, or the actual number of objects, being returned in the data property.
 * data - an array of objects, containing the paged data
 */

export interface PagedData<T> {
    page: number,
    limit: number,
    length: number,
    data: Array<T>,
}