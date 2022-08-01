/**
 * This interface holds the details of some "error" that may have occurred while getting API data. It could be as simple
 * as an invalid email or id was sent in the request, or some more serious backend failure. Either way, this interface
 * encapsulates the api error code, and a human readable message that can be displayed to end users.
 */
export default interface ErrorResult {
    code: number,
    message: string,
}