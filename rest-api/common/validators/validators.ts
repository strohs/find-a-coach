import mongoose from "mongoose";
import aqp from "api-query-params";

/**
 * returns true if numStr contains only digits and NO OTHER CHARACTERS
 * @param numStr
 */
export function validDigitOnlyString(numStr: string): boolean {
    const digitPat = /^\d+$/;
    return digitPat.test(numStr);
}

/**
 * returns true if intStr is an integer between min and max inclusive
 * @param intStr the numeric string to test
 * @param min minimum value allowed
 * @param max maximum value allowed
 */
export function validIntegerBetween(intStr: string, min = 0, max = Number.MAX_SAFE_INTEGER): boolean {
    const num = Number.parseInt(intStr, 10);
    return (validDigitOnlyString(intStr)) && !(Number.isNaN(num) || num < min || num > max);
}

/**
 * returns true if str is not undefined or null AND its length is between min and max inclusive
 * @param str
 * @param min
 * @param max
 */
export function validateStringLength(str: string, min: number, max: number):boolean {
    if (str) {
        return str.length >= min && str.length <= max;
    } else {
        return false;
    }
}

/**
 * makes sure all the property names in testedObj are in validProps. The non-matching names will be returned in an array.
 * The test is case-sensitive
 * @param validProps
 * @param testedObj
 */
export function filterNonMatchingProperties(validProps: Array<string>, testedObj: Record<string, string>): Array<string> {
    return Object.keys(testedObj).filter(key => {
        return !validProps.includes(key);
    });
}

/**
 * validates that the given id string is a valid (well-formed) mongoDB object ID
 * @param id
 */
export function validateObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}