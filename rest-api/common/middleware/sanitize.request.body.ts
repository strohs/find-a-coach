import {debug} from "debug";
import express from "express";
import mongoSanitize from 'express-mongo-sanitize';

const log: debug.IDebugger = debug('app:sanitizeRequestBody');

export default function sanitizeRequestBody(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): void
{
    if (req.body) {
        // allowing dots since some messages may contain punctuation characters, such as periods.
        const sanitized = mongoSanitize.sanitize(req.body, {
            allowDots: true
        });
        log(`after sanitize: `, sanitized);
    } else {
        log(`no sanitization performed req.body was empty`);
    }

    next();
}