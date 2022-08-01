/**
 * The common properties that will be returned for any request to this API
 */
export interface BaseResponse {
    code: number,
    message: string,
    data: any,
}