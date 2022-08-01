import mongoose from 'mongoose';
import * as EmailValidator from "email-validator";
import {validIntegerBetween} from "../../common/validators/validators";
const {Schema} = mongoose;

export interface ICoachModel extends mongoose.Document {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    description: string;
    expertise: Array<string>;
    roles: Array<string>;
    hourlyRate: number;
    imageUrl: string;
    createdAt: Date;
}

const coachSchema = new Schema<ICoachModel>({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            (v: string) => Promise.resolve(EmailValidator.validate(v)),
            '{PATH}: {VALUE} is not a valid email address'
        ]
    },
    // assumed that password will already be encrypted
    password: {
        type: String,
        required: true,
        minLength: [8, `{PATH} must be at least 8 characters`],
        maxLength: [256, `{PATH} must not be more than 256 characters`],
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: [512, `{PATH} must not be more than 512 characters`],
    },
    expertise: {
        type: [String],
        required: true,
        set: (exps: string[]) => exps.map(e => e.toLowerCase()),
        validate: [
            (v: string) => Promise.resolve(v.length > 0),
            '{PATH} must contain at least one value'
        ]
    },
    // for now, the only two roles we will allow are "user" and "admin"
    roles: {
        type: [String],
        default: ["user"],
    },
    hourlyRate: {
        type: Number,
        required: true,
        validate: [
            (v: string) => Promise.resolve(validIntegerBetween(v, 1, 1000000)),
            '{PATH} must be a valid integer between 1 and 1000000. received {VALUE}'
        ]
    },
    imageUrl: {
        type: String,
        default: '/avatars/avatar.png',
    },
},{
    //collection: 'coaches'
    timestamps: true
});

export const Coach = mongoose.model<ICoachModel>('Coach', coachSchema);