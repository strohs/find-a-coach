const isProduction = import.meta.env.PROD;

// config options for the vuejs3-logger package
const vue3LoggerConfig = {
    isEnabled: true,
    logLevel: isProduction ? 'error' : 'debug',
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: true,
    separator: '|',
    showConsoleColors: true,
}

export default vue3LoggerConfig;