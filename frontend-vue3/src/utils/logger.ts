// A basic logging utility that logs to the console, AND that won't log debug messages if we are in production environment

const isProduction = import.meta.env.PROD;

type log_level = 'debug' | 'info' | 'warn' | 'error';

const logger = {
    debug: (...rest: any[]) => {
        if (!isProduction) {
            console.debug(...rest);
        }
    },

    info: (...rest: any[]) => {
        if (!isProduction) {
            console.info(...rest);
        }
    },

    warn: (...rest: any[]) => {
        if (!isProduction) {
            console.warn(...rest);
        }
    },

    error: (...rest: any[]) => {
        console.error(...rest);
    },
}

export default logger;