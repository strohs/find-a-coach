/**
 * A "base" error class for handling errors that occur when calling the REST api.
 * code - keeps track of the error code returned by the API, usually this will be an HTTP 4XX or 5xx code
 * message - a human readable description of the error, returned by the api, and is suitable to be displayed to end-users
 */
class ApiError extends Error {
    code: number;
    message: string;

    constructor(code: number, message = '') {
        super(message);
        this.code = code;
        this.message = message;
    }
}

export default ApiError;