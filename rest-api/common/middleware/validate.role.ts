import {debug} from "debug";
import express from "express";

const log: debug.IDebugger = debug('app:tokenHasAdminRole');

export default function tokenHasAdminRole(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): void
{
    log(`isAuth ${req.isAuth} id:${req.authToken?.id} roles:${req.authToken?.roles}`);

    if (req.isAuth && req.authToken && req.authToken.roles.includes("admin")) {
        next();
    } else {
        res.status(401).send({
            message: `must be an administrator to perform this action`,
        });
    }
}