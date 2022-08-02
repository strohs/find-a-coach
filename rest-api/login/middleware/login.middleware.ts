import debug from "debug";
import express, {NextFunction} from "express";
import * as EmailValidator from "email-validator";
import bcrypt from "bcryptjs";
import ApiError from "../../common/errors/ApiError";
import {validateStringLength} from "../../common/validators/validators";
import {Error} from "mongoose";

const log: debug.IDebugger = debug('app:login-middleware');

/**
 * Express middleware class for common functionality related to logging in a user
 */
class LoginMiddleware {

    /**
     * validate email is present and is a valid (well-formed) email address
     */
    async validateEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
        log(`validating email:${req.body.email}`);

        if (req.body.email) {
            req.body.email = req.body.email.trim();
            if (!EmailValidator.validate(req.body.email)) {
                res.status(401).send({ message: `email: ${req.body.email} is not a valid email address`});
            } else {
                next();
            }
        } else {
            res.status(401).send( { message: `email is missing`});
        }
    }

    /**
     * validate password length is between 1 and 8 characters
     */
    async validatePasswordLength(req: express.Request, res: express.Response, next: express.NextFunction) {
        log(`validating password length:${req.body.password}`);

        if (req.body.password) {
            req.body.password = req.body.password.trim();
            if (!validateStringLength(req.body.password, 1, 8)) {
                res.status(401).send( { message: `password is invalid` });
            } else {
                next();
            }
        } else {
            res.status(401).send( { message: `password is missing` });
        }
    }

    /**
     * attempts to encrypt req.body.password and stores the encrypted password back in req.body.password
     */
    async encryptPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body.password) {
            try {
                req.body.password = await bcrypt.hash(req.body.password, 12);
                log(`encrypted password is:${req.body.password}`);
                next();
            } catch (e) {
                log(`ERROR: trying to bcrypt password:${req.body.password}`, e);
                if (e instanceof Error) {
                    throw new ApiError(500, ``, e.message);
                }

            }

        } else {
            res.status(401).send( { message: `password is missing`});
        }
    }

}

export default new LoginMiddleware();