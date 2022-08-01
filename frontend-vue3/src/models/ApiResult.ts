/**
 * ApiResult models the base properties that will always be returned from a call to the find-a-coach REST API
 *
 * ApiResult.code - a three digit response code that indicates the success or failure of the request.
 *                  It piggybacks on top of the standard HTTP codes:
 *                  2xx codes are success codes and the ApiResult.data property will contain the requested data
 *                  4xx codes indicates a resource could not be found or does not exist
 *                  5xx codes are internal server errors with the REST Api
 *  ApiResult.message - a human readable description of the code should the API return a 4xx or 5xx code.
 *                      For 2xx codes this will usually be set to "OK"
 *  ApiResult.data - will contain the actual requested data from the Api. It's type will vary depending upon the
 *                   data requested
 */
export default interface ApiResult<T> {
    code: number,
    message: string,
    data?: T,
}