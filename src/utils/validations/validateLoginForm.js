import { isPasswordStrong } from "./passwordValidation";


export const validateLoginForm = (name: string, value: string) => {
    let errorMsg = "";

    switch (name) {
        case "email":
            if (!value) errorMsg = "Email cannot be empty.";
            else if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value))
                errorMsg = "Please enter a valid email address (e.g., name@domain.com).";
            break;

        case "password":
            if (!value) {
                errorMsg = "Password is required.";
            } else {
                const { minLength } = isPasswordStrong(value);

                if (!minLength) {
                    errorMsg = "Password must be at least 8 characters long.";
                }
            }
            break;
    }

    return errorMsg;
};