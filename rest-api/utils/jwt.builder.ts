//import readline from "readline";
import jwt from "jsonwebtoken";

/**
 * a command line, node.js program to generate a self-signed JSON Web Token that can be used with
 * the find-a-coach API. REMEMBER: you must first compile this file with tsc and then run it using the
 * node command
 *
 * to run:      node jwt.builder.js COACH_ID ROLE1,ROLE2,... EXPIRATION_TIME_MS
 * @param id the DB id of the coach
 * @param roles a comma separated string containing the roles that should be granted to the coach,
 * (for now, only "user" and "admin" are valid) i.e.:  "user,admin"
 * @param expiresInMs the time the token should expire, in milliseconds
 * @param signingSecret the string to sign the token with, defaults to "somesupersecretstring"
 */


const id = process.argv[2];
const roleStr = process.argv[3] || "user";
const roles = roleStr.split(",");
const expMs = process.argv[4] || "600000";
const signingSecret = process.argv[5] || "somesupersecretstring";

console.log("id =", id);
console.log("roles =", roles);
console.log("expMs =", expMs);
console.log("signingSecret", signingSecret);

export function buildJwt(id: string, roles: Array<string>, expiresInMs = "600000", signingSecret = "somesupersecretstring"): string {
    return jwt.sign(
        {id, roles},
        signingSecret,
        {expiresIn: expiresInMs}
    );
}

const token = buildJwt(id, roles, expMs, signingSecret);
console.log("jwt =", token);

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false,
// });
//
// // id role1,role2 600000 somesupersecretstring
// rl.on('line', function (line) {
//     console.log(`line =`, line);
//     const args = line.split(" ");
//     const id = args[0];
//     const roleStr = args[1];
//     const expireMs = args[2];
//     const signingSecret = args[3];
//     const roles = roleStr.split(",");
//     console.log(id, roles, expireMs, signingSecret);
//
//     const jwt = buildJwt(id, roles, expireMs, signingSecret);
//     console.log(jwt);
//     return jwt;
// });