import { email } from "@vee-validate/rules";


// validator that a form input is required
export const required = (value: string, fieldName: string = "field"): string | boolean => {
    if (value && value.trim()) {
        return true;
    } else {
        return `${fieldName} is required`;
    }
}

// validates the input is required and is no greater than maxLength
export const requiredWithMaxLength = (value: string, maxLength: number): string | boolean => {
    if (!value) {
        return `field is required`;
    }
    else if (value.length > maxLength ) {
        return `must be no more than ${maxLength} characters`
    }
    else {
        return true;
    }
}

export const minLength = (value: string, minLength: number): string | boolean => {
    if (value && value.trim().length >= minLength) {
        return true;
    } else {
        return `must be at least ${minLength} characters`
    }
}

export const maxLength = (value: string, maxLength: number): string | boolean => {
    if (value && value.trim().length <= maxLength) {
        return true;
    } else {
        return `must be no more than ${maxLength} characters`
    }
}

export const betweenValues = (value: string, min: number, max: number): string | boolean => {
    const parsedValue = Number.parseFloat(value);
    console.log('parsed value', parsedValue);
    if (!isNaN(parsedValue) && (min <= parsedValue) && (parsedValue <= max)) {
        return true;
    } else {
        return `must be a numerical value between ${min} and ${max}`;
    }
}

export const validEmail = (value: string): string | boolean => {
    if (value && email(value)) {
        return true;
    } else {
        return `must be a valid email`
    }
}
