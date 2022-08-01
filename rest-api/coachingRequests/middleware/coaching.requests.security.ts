import {debug} from "debug";
import express from "express";

const log: debug.IDebugger = debug('app:coaching-requests-security');

class CoachingRequestsSecurity {

    tokenHasAdminRole(req: express.Request): boolean {
        if (req.isAuth && req.authToken) {
            return req.authToken.roles.includes("admin");
        } else {
            return false;
        }
    }
}