/**
 * Details of a Coach
 */
export interface Coach {
    id: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    description: string,
    hourlyRate: number,
    expertise: Array<string>,
    roles: Array<string>,
    imageUrl: string,
    createdAt?: Date,
}

export function buildCoach(
    id = "-1",
    firstName = '',
    lastName = '',
    email = '',
    description='',
    password = '',
    hourlyRate = 0,
    expertise = new Array<string>(),
    roles = ["user"],
    imageUrl = ''): Coach
{
    return {
        id,
        firstName,
        lastName,
        description,
        password,
        email,
        hourlyRate,
        expertise,
        roles,
        imageUrl,
    }
}