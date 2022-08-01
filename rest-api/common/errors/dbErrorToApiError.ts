import mongoose from "mongoose";
import ApiError from "./ApiError";

/**
 * maps mongoose specific database errors to an ApiError.
 *
 * @param e - the error to map:
 * Mongoose ValidationErrors and CastErrors are mapped to a 400 response code
 * Any Other Mongoose db errors are mapped to a 500 response code
 * Any ApiErrors are left untouched
 */
export default function dbErrorToApiError(e: Error): ApiError {
    console.error(e);
    if (e instanceof mongoose.Error.ValidationError) {
        return new ApiError(400, e.message ,e.message);
    } else if (e instanceof mongoose.Error.CastError) {
        return new ApiError(400, `invalid ${e.kind} of ${e.value}`, e.toString());
    } else if (e instanceof ApiError) {
        return e;
    } else {
        return new ApiError(500, '', e.message);
    }
}