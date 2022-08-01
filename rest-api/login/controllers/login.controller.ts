import express from "express";
import debug from "debug";
import loginService from "../services/login.service"
import {LoginResponseDto} from "../dtos/login.response.dto";

const log: debug.IDebugger = debug('app:login-controller');

class LoginController {

    /**
     * login a coach when their credentials are sent via as JSON in a POST request
     * If credentials are good, a LoginResponseDto is returned, containing a JWT token string, plus the details
     * of the coach
     */
    async postLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(`postLogin`);
            const coach = await loginService.validateCredentials(req.body.email, req.body.password);
            if (coach) {
                // generate token string
                const token = await loginService.generateToken(coach);
                const respDto: LoginResponseDto = {
                    message: `OK`,
                    token,
                    coach
                }
                res.status(200).send(respDto);
            } else {
                res.status(401).send({ message: `invalid email or password` });
            }

        } catch (e) {
            next(e);
        }
    }

}

export default new LoginController();