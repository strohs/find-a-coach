/**
 * A "base" error class for handling errors that occur throughout the rest api.
 *
 * code - keeps track of a custom error code, usually this will be an HTTP 4XX or 5xx code
 * message - human-readable description of the error that will be sent back to consumers of the API
 * debugMessage - human-readable message intended for developers in order to debug problems
 */
class ApiError extends Error {
    code: number;
    message: string;
    debugMessage: string;

    constructor(code: number, message = '', debugMessage = '') {
        super(message);
        this.code = code;
        this.message = message;
        this.debugMessage = debugMessage;
    }
}

export default ApiError;