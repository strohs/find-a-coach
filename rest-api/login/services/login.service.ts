import debug from "debug";
import bcrypt from "bcryptjs"
import coachService from "../../coaches/services/coaches.service";
import Token from "../../common/auth/token";
import {CreateCoachDto} from "../../coaches/dtos/create.coach.dto";

const log: debug.IDebugger = debug('app:login-service');

class LoginService {

    constructor() {
        log(`login-service created`);
    }

    /**
     * validate a user's login credentials, and return a CreateCoachDto.
     * If the credentials are invalid, Null is returned.
     *
     * @param email the user's email address
     * @param password the user's password
     */
    validateCredentials = async (email: string, password: string): Promise<CreateCoachDto | null> => {
        try {
            const coach: CreateCoachDto | null = await coachService.getCoachByEmail(email);
            log(`getCoachByEmail returned:`, coach);

            if (coach?.password) {
                const pwMatch = await this.matchPasswords(password, coach.password);
                if (pwMatch) {
                    log(`passwords MATCH`);
                    return coach;
                } else {
                    log(`passwords DO NOT MATCH`);
                    return null;
                }
            } else {
                return null;
            }
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns a JWT string using coach.id and coach.roles to fill in the payload fields of the JWT.
     *
     * @param coach
     */
    async generateToken(coach: CreateCoachDto): Promise<string> {
        try {
            // for now, all coaches get a "user" role by default
            const tokenStr = Token.generate({  id: coach.id!, roles: coach.roles! });
            log(`generated token for coach ${coach.id}  ${tokenStr}`);
            return tokenStr;
        } catch (e) {
            log(e);
            throw e;
        }
    }

    /**
     * returns a promise that resolves to true if the plainPassword matches the hashedPassword, else returns false
     *
     * @param plainPassword
     * @param hashedPassword
     */
    async matchPasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

}

export default new LoginService();