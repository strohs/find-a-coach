import express from 'express';

/**
 * Class holding common functionality for all routes
 */
export abstract class CommonRoutesConfig {
    // reference to the express application object
    app: express.Application;

    // the name of the route
    name: string;

    // current version of the API
    apiVersion = 'v1';

    // could add a logger here

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }

    /**
     * returns the name of the route
     */
    getName(): string {
        return this.name;
    }

    /**
     * returns the current api version, as a string, which can be used to prefix your routes
     */
    getApiVersion(): string {
        return this.apiVersion;
    }

    /**
     * Endpoints of a route should be configured within this method
     */
    abstract configureRoutes(): express.Application;
}