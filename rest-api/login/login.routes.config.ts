import {CommonRoutesConfig} from "../common/common.routes.config";
import LoginMiddleware from "./middleware/login.middleware";
import LoginController from "./controllers/login.controller";
import express from "express";

/**
 * Routes used by coaches to login to the web-site
 */
export default class LoginRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'LoginRoutes');
    }

    configureRoutes(): express.Application {
        this.app.route('/login')
            .post(
                LoginMiddleware.validateEmail,
                LoginMiddleware.validatePasswordLength,
                LoginController.postLogin,
            );

        return this.app;
    }
}