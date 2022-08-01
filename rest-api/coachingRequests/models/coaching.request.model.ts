import mongoose, {Document, PopulatedDoc, Schema} from 'mongoose';
import * as EmailValidator from 'email-validator';
import {ICoachModel} from "../../coaches/models/coach.model";

interface ICoachingRequestModel extends mongoose.Document {
    fromEmail: string,
    message: string,
    coach: PopulatedDoc<ICoachModel & Document>,
    reply: string,
    replyAt: Date,
    createdAt: Date,
}

const coachingRequestSchema = new Schema({
    fromEmail: {
        type: String,
        required: true,
        maxLength: [40, '{PATH} must not be greater than 40 characters'],
        validate: [
            (v: string) => Promise.resolve(EmailValidator.validate(v)),
            '{PATH}: {VALUE} is not a valid email address'
        ]
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: "Coach",
        index: true,
    },
    message: {
        type: String,
        required: true,
        minLength: [1, '{PATH} must be at least one character'],
        maxLength: [256, '{PATH} must not be greater than 256 characters'],
    },
    reply: {
        type: String,
        required: false,
        minLength: [1, `{PATH} must be at least one character`],
        maxLength: [256, '{PATH} must not be greater than 256 characters'],
    },
    replyAt: {
        type: Date,
        required: false,
    }
},{
    //collection: 'requests'
    timestamps: true,
});

coachingRequestSchema.index({ coachId: 1, createdAt: -1 });

const CoachingRequest = mongoose.model<ICoachingRequestModel>('CoachingRequest', coachingRequestSchema);

export { ICoachingRequestModel, coachingRequestSchema, CoachingRequest };