import ApiResult from "../models/ApiResult";
import axios from "../configs/axios.config";
import {AxiosError} from "axios";
import logger from "../utils/logger";

/**
 * Base API class encapsulates a logger and the configured axios library we will be using for all HTTP requests
 * to the REST Api
 */
export default class BaseApi {

    // our ad hoc logger that logs to the browser console
    logger = logger;

    // our configured axios http client
    axios = axios;

    constructor() {}

    /**
     * Inspects an axios error to see if a response was actually received from the API.
     * If so, the api will have set the message property in the response property of the error.
     * These properties will be mapped into the ApiResult object.
     *
     * If an actual, unexpected axios error did occur, the error will also be mapped into the ApiResult,
     * with ApiResult.code set to 500, and ApiResult.message set to:
     * 'an unexpected error has occurred, please try again later'.
     *
     * @param e the AxiosError to be mapped
     */
    mapAxiosError(e: unknown): ApiResult<any> {
        if (e instanceof AxiosError && e.response) {
            logger.error(`mapAxiosError`, e);
            // a response was returned from the backend, it could simply be a 4xx response
            // The api should always send a more descriptive message in `response.data.message`
            return {
                code: e.response.status,
                // @ts-ignore
                message: e.response?.data?.message,
            };
        } else {
            // some unexpected error type was encountered, map it to a 500 ApiResult
            return {
                code: 500,
                message: `an unexpected error has occurred, please try again later`
            };
        }
    }

}