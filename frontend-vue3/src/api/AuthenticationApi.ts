import BaseApi from "./BaseApi";
import ApiResult from "../models/ApiResult";
import {LoginResult} from "../models/LoginResult";


/**
 * Class containing methods for logging in a coach to the find-a-coach service by issuing
 * a JWT
 */
class AuthenticationApi extends BaseApi {

    constructor() {
        super();
    }

    /**
     * Call the REST api to login a coach using their email and password.
     * Returns a LoginResponse object containing the details of the login. Callers must check LoginResult.code to
     * see if the request succeeded. Any code in the 2XX range will be a successful login, while 4xx and 5xx will
     * be some sort of error. Error message will be in LoginResult.message.
     * @param email
     * @param password
     *
     */
    loginCoach = async (email: string, password: string): Promise<ApiResult<LoginResult>> => {
        try {
            this.logger.debug(`/login ${email} ${password}`);

            const res = await this.axios.post('/login', {
                email: email,
                password: password
            });

            this.logger.debug(`/login ${res.status} ${res.data.message}`);
            this.logger.debug(`auth token is ${res.data.token}`);

            return {
                code: res.status,
                message: res.data.message,
                data: {
                    token: res.data.token,
                    coach: res.data.coach,
                },
            };
        } catch (e) {
            return this.mapAxiosError(e);
        }
    }
}

export default new AuthenticationApi();