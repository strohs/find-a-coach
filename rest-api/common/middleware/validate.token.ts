import express, {NextFunction} from "express";
import debug from "debug";
import Token from "../auth/token";
import {TokenData} from "../interfaces/token.data";
import ApiError from "../errors/ApiError";

const log: debug.IDebugger = debug('app:auth-token');

/**
 * Attempts to validate a JWT.
 * This function expects the token to be sent as a bearer token in the Authorization header.
 * Therefore, the authorization header should look like:
 *
 *                  Authorization: Bearer <token-string-here>
 *
 * If the JWT was successfully authenticated then the following properties will be set in the `req` object
 * req.isAuth = true // the user is authenticated
 * req.authToken = a `TokenData` object containing the user's `id` and their `roles`
 * req.authTokenStr = <the raw jwt string>
 *
 * if the token failed authentication for any reason, `req.isAuth` will be set to `false`
 *
 * @param req
 * @param res
 * @param next
 * @throws ApiError if the token was not found or could not be authenticated
 */
export async function authenticateToken(req: express.Request, res: express.Response, next: NextFunction) {
    const authHeader = req.get('Authorization');
    log(`Authorization header=${authHeader}`);

    // during development, we can disable authenticating tokens and just generate a "admin" token for
    // every request
    let AUTH_CHECK_DISABLED = false;
    if (process.env.TOKEN_DISABLE && process.env.TOKEN_DISABLE == "true") {
        AUTH_CHECK_DISABLED = true;
    }

    if (AUTH_CHECK_DISABLED) {
        log('TOKEN_DISABLE = true, auto generating a temporary admin token');
        const tokenData = { id: '1', roles: ['admin']} as TokenData;
        const tokenStr = await Token.generate(tokenData);
        req.isAuth = true;
        req.authToken = tokenData;
        req.authTokenStr = tokenStr;
        next();
    } else {
        // if no Authentication header was sent, then the request will not be authorized
        if (!authHeader) {
            log('Authentication header was not sent, request is not authenticated')
            req.isAuth = false;
            next(new ApiError(401, "not authorized", "Authentication header was missing"));
        } else {
            // something was sent in the Authorization Header, hopefully a token, try to validate it
            const tokenStr = authHeader.split(' ')[1];
            try {
                req.authTokenStr = tokenStr;
                const token: TokenData = await Token.verify(tokenStr);
                log(`token authorized ${tokenStr}`, token);
                req.authToken = token;
                next();
            } catch (apiError) {
                log(apiError);
                req.isAuth = false;
                next(apiError);
            }
        }
    }

}