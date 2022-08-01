import {Model, Schema, model, Types, UpdateWriteOpResult} from 'mongoose';
import {ICoachingRequestModel, coachingRequestSchema, CoachingRequest} from "../../coachingRequests/models/coaching.request.model";
import debug from "debug";

const log: debug.IDebugger = debug('app:weekly-coaching-requests-model');

interface IWeeklyCoachingRequest {
    id: string,
    yearWeek: string,
    coachId: Types.ObjectId,
    requests: Array<ICoachingRequestModel>,
    createdAt?: Date,
}

// declare statics used by IWeeklyCoachingRequestModel
interface IWeeklyCoachingRequestModel extends Model<IWeeklyCoachingRequest> {
    findByCoachIdAndDate: (coachId: string, createdDate: Date) => Promise<IWeeklyCoachingRequest | null>,
    findByCoachIdAndYearWeek: (coachId: string, yearWeek: string) => Promise<IWeeklyCoachingRequest | null>,
    insertCoachingRequest: (coachingRequest: ICoachingRequestModel) => Promise<UpdateWriteOpResult>,
    updateCoachingRequest: (coachingRequest: ICoachingRequestModel) => Promise<UpdateWriteOpResult>,
    deleteCoachingRequest: (coachingRequest: ICoachingRequestModel) => Promise<UpdateWriteOpResult>,
    deleteByCoachingRequestId: (coachingRequestId: string) => Promise<UpdateWriteOpResult>,
}

/**
 * returns the week of the year from the passed in date
 * @param date {Date} the date from which you want to compute the week of the year
 * @param dowOffset {number} a number that indicates if you want the returned week of the year to be 0-based or
 * 1-based. 0 based means the first week of the year will start at zero, while 1 means it will start at one. The
 * default is 0-based
 */
function getWeekOfYear(date: Date, dowOffset: 0 | 1 = 0): number {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */
    const newYear = new Date(date.getFullYear(),0,1);
    let day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    const dayNum = Math.floor((date.getTime() - newYear.getTime() -
        (date.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    let weekNum;
    //if the year starts before the middle of a week
    if(day < 4) {
        weekNum = Math.floor((dayNum+day-1)/7) + 1;
        if(weekNum > 52) {
            const nYear = new Date(date.getFullYear() + 1,0,1);
            let nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
               the week, it is week #1 of that year*/
            weekNum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weekNum = Math.floor((dayNum+day-1)/7);
    }
    return weekNum;
}

const weeklyCoachingRequestSchema = new Schema<IWeeklyCoachingRequest, IWeeklyCoachingRequestModel>({
    // example: "2020-18"  2020 is the year, 18 is the week of year (0-based) i.e. 0 is the first week of the year
    yearWeek: {
        type: String,
        required: true
    },
    coachId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    requests: {
        type: [coachingRequestSchema],
    },
},{
    //collection: 'requests'
    timestamps: true
});

// create a compound index on coach (id) and yearWeek
weeklyCoachingRequestSchema.index({ coachId: 1, yearWeek: -1 });

// finds a WeeklyCoachingRequest document by coachId and sets the yearWeek field to the year and weekOfYear of the
// passed in date
/**
 * finds a WeeklyCoachingRequest document by coachId and sets the yearWeek field to the year and weekOfYear of the
 * passed in createdDate. Returns null if no document could be found.
 * @param coachId
 * @param createdDate
 */
weeklyCoachingRequestSchema.statics.findByCoachIdAndDate = async function (
    this: IWeeklyCoachingRequestModel,
    coachId: string,
    createdDate: Date): Promise<IWeeklyCoachingRequest | null>
{
    const year = createdDate.getFullYear();
    const weekOfYear = getWeekOfYear(createdDate);
    const coach = Types.ObjectId(coachId);
    return this
        .findOne(
            { yearWeek: `${year}-${weekOfYear}`, coachId: coach }
        );
};

// finds a WeeklyCoachingRequest using the passed in coachId and yearWeek
weeklyCoachingRequestSchema.statics.findByCoachIdAndYearWeek = async function (
    this: IWeeklyCoachingRequestModel,
    coachId: string,
    yearWeek: string): Promise<IWeeklyCoachingRequest | null>
{
    const coach = Types.ObjectId(coachId);
    return this
        .findOne(
            { yearWeek: yearWeek, coachId: coach }
        );
};

// inserts a new coachingRequest document into WeeklyCoachingRequests, for the specified coachId. The yearWeek field
// is populated using the createdAt date in the coachingRequest
// returns
weeklyCoachingRequestSchema.statics.insertCoachingRequest = async function(
    coachingRequest: ICoachingRequestModel): Promise<UpdateWriteOpResult>
{
    const yearWeek = `${coachingRequest.createdAt.getFullYear()}-${getWeekOfYear(coachingRequest.createdAt)}`;
    const coachId = coachingRequest.coach.id;
    const res: UpdateWriteOpResult = await this.updateOne(
        { coachId: coachId, yearWeek: yearWeek },
        { $push: { requests: coachingRequest } },
        { upsert: true },
    );
    return res;
};

/**
 * updates (overwrites) a single CoachingRequest sub-document within WeeklyCoachingRequest.requests with
 * the provided coachingRequest
 * @param coachingRequest - the coachingRequest sub-document to be placed into the requests array
 */
weeklyCoachingRequestSchema.statics.updateCoachingRequest = async function(
    coachingRequest: ICoachingRequestModel): Promise<IWeeklyCoachingRequest | null>
{
    const yearWeek = `${coachingRequest.createdAt.getFullYear()}-${getWeekOfYear(coachingRequest.createdAt)}`;
    const coachId = Types.ObjectId(coachingRequest.coach._id);
    const found = await this.findOne(
        {
            coachId: coachId,
            yearWeek: yearWeek
        }
    );
    if (found) {
        log("found weekly coaching document for update: ", found);
        found.requests.map(req => {
            if (req._id.toString() === coachingRequest._id.toString()) {
                log('updating coaching request:', req._id);
                req.reply = coachingRequest.reply;
                req.replyAt = coachingRequest.replyAt;
                req.message = coachingRequest.message;
                req.fromEmail = coachingRequest.fromEmail;
            }
        });
        const res = await found.save();
        return res;
    } else {
        return null;
    }


    // const res = await this.updateOne(
    //     {
    //         coachId: coachId,
    //         yearWeek: yearWeek,
    //         "requests._id": coachingRequest._id,
    //     },
    //     { $set: { "requests.$": coachingRequest} }
    // )
}

// deletes the specified CoachingRequest from the WeeklyCoachingRequests collection. There should be only one such
// coachingRequest, so the yearWeek will be pulled from the coachingRequest.createdAt field
// returns an UpdateWriteOpResult document containing the number of documents deleted
weeklyCoachingRequestSchema.statics.deleteCoachingRequest = async function(
    coachingRequest: ICoachingRequestModel): Promise<UpdateWriteOpResult>
{
    const yearWeek = `${coachingRequest.createdAt.getFullYear()}-${getWeekOfYear(coachingRequest.createdAt)}`;
    const coachId = coachingRequest.coach.id;

    const res: UpdateWriteOpResult = await this.updateOne(
        { coachId: coachId,  yearWeek },
        { $pull: { requests: coachingRequest } }
    );
    return res;
}

// attempts to delete the specified coachingRequest from weeklyCoachingRequests collection. This function will first
// try to retrieve the coachingRequest from the coachingRequests collection. If found, it will use the coachId and
// createdAt date to remove the coachingRequest from WeeklyCoachingRequests.
// returns null of the specified coachingRequestId was not found. Else returns UpdateWriteOpResult
weeklyCoachingRequestSchema.statics.deleteByCoachingRequestId = async function(
    coachingRequestId: string
): Promise<UpdateWriteOpResult | null>
{
    const coachingRequest: ICoachingRequestModel | null = await CoachingRequest
        .findById(coachingRequestId)
        .populate('coach');

    if (coachingRequest) {
        const yearWeek = `${coachingRequest.createdAt.getFullYear()}-${getWeekOfYear(coachingRequest.createdAt)}`;
        const res = await this.updateOne(
            { coachId: coachingRequest.coach.id, yearWeek },
            { $pull: { requests: coachingRequest } },
        );
        return res;
    } else {
        return null;
    }
}


const WeeklyCoachingRequest = model<IWeeklyCoachingRequest, IWeeklyCoachingRequestModel>('WeeklyCoachingRequest', weeklyCoachingRequestSchema);

export {IWeeklyCoachingRequest, weeklyCoachingRequestSchema, WeeklyCoachingRequest, getWeekOfYear};