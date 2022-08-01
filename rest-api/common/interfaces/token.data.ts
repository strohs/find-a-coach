/**
 * Data that will be stored in the payload of JWTs created by this application
 * @param id the user's database id
 * @param roles any roles granted to a user
 */
export interface TokenData {
    id: string,
    roles: Array<string>
}