/**
 * This is a utility script that generates random data for the findACoachDB.
 * It can be called after the express app and database is started in order to populate
 * the coaches and coachingRequests with random data
 */

import random from 'generate-random-data';
import bcrypt from 'bcryptjs';
import debug from "debug";
import mongoose from "mongoose";
import {Coach, ICoachModel} from "../../coaches/models/coach.model";
import {CoachingRequest, ICoachingRequestModel} from "../../coachingRequests/models/coaching.request.model";
import {getWeekOfYear, IWeeklyCoachingRequest, WeeklyCoachingRequest} from "../../weeklyCoachingRequests/models/weekly.coaching.request.model";

const log: debug.IDebugger = debug('app:bootstrap-random-data');

/**
 * hash a plain text password
 * @param password - plain text password string
 * @returns {Promise<String>} - a promise that resolves to the hashed password String
 */
const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            return hashedPassword;
        });
};


/**
 * generate random integer from 0 to max (inclusive)
 */
const rand = (max: number): number => Math.floor(Math.random() * max);


/**
 * generate a random data between start and end, with a random hour between startHour and emndHour
 * @param start {Date} start Date
 * @param end {Date} end Date
 * @param startHour {number} number between 0 - 23
 * @param endHour {number} number between 0 - 23
 * @returns {Date}
 */
function randomDate(start: Date, end: Date, startHour= 0, endHour = 23): Date {
    const date = new Date(+start + Math.random() * (end.getTime() - start.getTime()));
    const hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
}



/**
 * generates random coach data and returns it as an array of coach objects.
 * @param total_coaches {number} - the total number of random coaches to generate
 */
async function genRandomCoachData(total_coaches: number): Promise<Array<ICoachModel>> {
    // each coach will have the default password of: "password", encrypted by bcrypt
    const DEFAULT_PASSWORD = await hashPassword("password");

    // this is an array of possible expertise(s) a coach may have. We will pull randomly from this list to generate
    // a coach's expertise.
    const expertise: Array<string> = [
        "html", "css", "aws", "azure", "c#", "haskell", "networking", "big-data", "javascript", "java", "rust",
        "node.js", "python", "machine-learning", "spring-framework", "express-js", "postgresql", "mongodb", "UI-UX",
        "Scala", "clojure", "Swift", "iOS", "Android", "Docker"
    ];

    // generate a random expertise Array, that pulls from the expertise array
    // total {number} the amount of expertise strings to pull from the array
    // returns a new array containing the random expertise, AS A LOWER CASE String
    const generate_random_expertise = (total: number, expertiseArray: Array<string>): Array<string> => {
        const expertiseSet: Set<string> = new Set();
        for (let i = 0; i < total; i++) {
            const randomExpertise = expertiseArray[rand(expertiseArray.length)];
            expertiseSet.add( randomExpertise.toLowerCase() );
        }
        return Array.from(expertiseSet.values());
    }

    const coaches = [];

    for (let i = 1; i <= total_coaches; i++) {
        const coach = new Coach ({
            id: new mongoose.Types.ObjectId(i),
            firstName: random.int(0, 1) === 0 ? random.maleFirstName() : random.femaleFirstName(),
            lastName: random.lastName(),
            description: random.lorems(),
            // always hard code the first coach to have an email address of "user@findacoach.com"
            email: i ===1 ? "user@findacoach.com" : random.email("findacoach.com"),
            // hourly rate between $1.00 and $250.99
            hourlyRate: random.int(1, 50099),
            expertise: generate_random_expertise( random.int(2,5), expertise),
            imageUrl: `/avatars/avatar${random.int(1,4)}.png`,
            password: DEFAULT_PASSWORD,
            createdAt: randomDate(new Date(1990, 0, 1), new Date(2020, 11, 30)),
        });

        coaches.push(coach);
    }

    // insert into DB
    return Coach.insertMany(coaches);
}

/**
 * Generate an "admin user" with email of: admin@findacoach.com and password = "password"
 */
async function genAdmin(): Promise<ICoachModel> {
    const DEFAULT_PASSWORD = await hashPassword("password");
    const admin = new Coach({
        id: new mongoose.Types.ObjectId(11111111),
        firstName: "admin",
        lastName: "admin",
        description: "I am the admin",
        email: "admin@findacoach.com",
        hourlyRate: 10000,
        expertise: ["admin"],
        roles: ["admin"],
        imageUrl: '/avatars/avatar1.png',
        password: DEFAULT_PASSWORD,
        createdAt: randomDate(new Date(1990, 0, 1), new Date(2020, 11, 30)),
    });
    const savedAdmin = await admin.save();
    return savedAdmin;
}


/**
 * generates random request data
 * @param total_requests - total number of requests to generate
 * @param coaches - an array of coach documents, this is used to assign a request to a random coach, pulled from this Array
 * @returns {*[]} an array of request objects
 */
function genRandomCoachingRequestData(total_requests: number, coaches: Array<ICoachModel>): Promise<Array<ICoachingRequestModel>> {
    const requests = [];
    // generate random request data
    for (let i = 0; i < total_requests; i++) {
        const randCoach: ICoachModel = coaches[rand(coaches.length)];
        const yesterday = new Date();
        const twoWeeksAgo = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        // generate a random first name with 50% chance of being either male or female
        const randomFirstName = random.int(0, 1) === 0 ? random.maleFirstName() : random.femaleFirstName();

        const createdAt = randomDate(twoWeeksAgo, yesterday);
        const request = new CoachingRequest ({
            message: `Hello ${randCoach.firstName}, my name is ${randomFirstName} and I need coaching for ${random.pickOne(randCoach.expertise)}`,
            fromEmail: random.email().replace(/\.\./g, "."),
            coach: randCoach,
            createdAt: createdAt,
        });
        requests.push(request);
    }

    return CoachingRequest.insertMany(requests);

}

/**
 * generate random coaching requests for a week. The request data will be pulled in from the `request` array
 * @param requests
 * @returns {*[]}
 */
function genWeeklyRequestData(
    requests: Array<ICoachingRequestModel>
): Promise<Array<IWeeklyCoachingRequest>> {

    // map each coaching request to a temporary requestMap, so we can build the weeklyRequest collection
    // The reqMap maps "coach-id_YYYY-WeekOfYear" string to an array of request objects
    const reqMap = new Map();
    const yearWeek = (date: Date) => `${date.getFullYear()}-${getWeekOfYear(date, 0)}`;

    requests.forEach((req) => {
        const date: Date = req.createdAt;
        const key = `${req.coach.id}_${yearWeek(date)}`;
        const reqArr = reqMap.get(key);
        if (reqArr) {
            reqArr.push(req);
        } else {
            reqMap.set(key, [req]);
        }
    });

    const weeklyRequests: Array<IWeeklyCoachingRequest> = [];
    reqMap.forEach((requests, coachKey) => {
        const [coachId, yearWeek] = coachKey.split("_");
        const coachingRequests: Array<ICoachingRequestModel> = reqMap.get(coachKey);
        // sort coachingRequests by createdAt ascending
        coachingRequests.sort((r1, r2) => r1.createdAt.getTime() - r2.createdAt.getTime());

        const weeklyRequest = new WeeklyCoachingRequest({
            coachId: coachingRequests[0].coach.id,
            yearWeek: yearWeek,
            requests: coachingRequests,
        });
        weeklyRequests.push(weeklyRequest);
    });

    return WeeklyCoachingRequest.insertMany(weeklyRequests);
}


async function generateRandomData(): Promise<void> {
    try {
        // drop the Database
        await mongoose.connection.dropDatabase();
        log('dropped database')

        // generate random coach data first
        const coachModels = await genRandomCoachData(25);
        log(`generated ${coachModels.length} random coach documents`);

        // generate random coaching request data
        const requestModels = await genRandomCoachingRequestData(500, coachModels);
        log(`generated ${requestModels.length} random coaching request documents`);

        // generate weekly requests from the requestModel data
        const weekRequestModels = await genWeeklyRequestData(requestModels);
        log(`generated ${weekRequestModels.length} random weekly coaching request documents`);

        // generate one admin user with the same email address and password
        const admin = await genAdmin();
        log(`admin user generated with email:${admin.email}`);

    } catch (err) {
        console.error('error during random data generation', err);
    }


}

export { generateRandomData };