import mongoose, {Connection} from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:dbClient');

/**
 * Wraps a connection to the mongoose client
 */
class MongooseClient {
    private readonly uri: string;

    constructor(dbUri: string) {
        this.uri = dbUri;
    }


    async connect(): Promise<boolean> {
        try {
            log(`attempting to connect to mongodb at ${this.uri}`);
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                autoIndex: true
            });
            return true;
        } catch (e) {
            log(`could not connect to mongodb: ${e}`);
            throw e;
        }
    }

    /**
     * returns the current connection object
     */
    get connection(): Connection {
        return mongoose.connection;
    }
}


export { MongooseClient };