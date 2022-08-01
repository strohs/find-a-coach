import jwt, {JsonWebTokenError, NotBeforeError, Secret, TokenExpiredError} from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import {TokenData} from "../interfaces/token.data";
import debug from "debug";

const log: debug.IDebugger = debug('app:token');

const SIGNING_SECRET: Secret = process.env.TOKEN_SIGNING_SECRET!;
const DEFAULT_EXPIRATION_MS: string = process.env.DEFAULT_TOKEN_EXPIRATION_MS!;

/**
 * The Token class is responsible for generating and also validating the JSON web tokens issued to end users
 * so that they can make requests to the REST API
 */
export default class Token {

    /**
     * generates a token string from the supplied TokenData and expiration time
     * @param data a TokenData object containing the data to include in the payload of the token
     * @param expiresIn the time until this token will expire, in milli-seconds
     */
    static async generate(data: TokenData, expiresIn = DEFAULT_EXPIRATION_MS ): Promise<string> {
        const token = jwt.sign(data, SIGNING_SECRET, { expiresIn: expiresIn });
        log(`token generate: ${token}`);
        return token;
    }

    /**
     * verifies that the passed in token string is a valid JWT.
     * If valid, returns a TokenData object.
     *
     * @param token the "raw" jwt string to verify
     * @throws ApiError with a 401 code if the token is invalid, expired, or if the token could
     * not be decoded due to some other reason.
     */
    static async verify(token: string): Promise<TokenData> {
        try {
            const data = await jwt.verify(token, SIGNING_SECRET);
            return data as TokenData;
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new ApiError(401,
                    `your token has expired`,
                    `TOKEN_EXPIRED for JWT=${token}, ${e.message}`);
            } else if (e instanceof JsonWebTokenError) {
                throw new ApiError(401,
                    `your token is malformed or not signed`,
                    `TOKEN_MALFORMED or token not signed for JWT=${token}, ${e.message}`);
            } else if (e instanceof NotBeforeError) {
                throw new ApiError(401,
                    `token cannot be used until after ${e.date}`,
                    `TOKEN_NOT_BEFORE token ${token} cannot be used until after ${e.date}, ${e.message}`);
            } else {
                throw new ApiError(500,
                    ``,
                    `unknown token error during token validation for JWT=${token}, ${e.message}`);
            }
        }
    }
}