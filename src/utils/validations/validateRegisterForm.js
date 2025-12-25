import { isValidPhoneNumber } from 'react-phone-number-input';

import { isPasswordStrong, isPasswordMatch } from "./passwordValidation";


interface RegisterForm {
  fullName?: string;
  email?: string;
  gender?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

type ValidationError = string | string[];

type PasswordCheckKey =
  | "minLength"
  | "hasUpper"
  | "hasLower"
  | "hasNumber"
  | "hasSymbol";

export const validateRegisterForm = (name: string, value: string, form: RegisterForm = {}): ValidationError => {
    let errorMsg: ValidationError = "";

    switch (name) {
        case "fullName":
            if (!value) errorMsg = "Full name is required.";
            else if (!/^[\p{L}\s]+$/u.test(value))
                errorMsg = "Full name must contain only letters and spaces. Special characters is required.";
            else if (value.trim().length < 3) errorMsg = "Name must be at least 3 characters long.";
            break;

        case "email":
            if (!value) errorMsg = "Email cannot be empty.";
            else if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value))
                errorMsg = "Please enter a valid email address (e.g., name@domain.com).";
            break;

        case "gender":
            if (!value) errorMsg = "Please select your gender.";
            break;

        case "phone":
            if (!value) errorMsg = "Phone number is required.";
            // if (value && value.replace(/\D/g, "").length < 9)
            //     errorMsg = "Nomor HP minimal 9 digit. (+62 ...)";
            else if (!isValidPhoneNumber(value)) errorMsg = `Invalid phone number: ${value}`;
            break;

        // case "password":
        //     if (!isPasswordStrong(value)) {
        //         errorMsg = "Minimal 8 karakter, huruf besar, kecil, angka & simbol.";
        //     } else if (form.confirmPassword && !isPasswordMatch(value, form.confirmPassword)) {
        //         errorMsg = "Kata sandi dan konfirmasi tidak cocok.";
        //     }
        //     break;

        case "password":
            if (!value) {
                errorMsg = "Password is required.";
            } else {

                const check = isPasswordStrong(value);

                const messages: Record<PasswordCheckKey, string> = {
                    minLength: "At least 8 characters.",
                    hasUpper: "Contains an uppercase letter.",
                    hasLower: "Contains a lowercase letter.",
                    hasNumber: "Contains a number.",
                    hasSymbol: "Contains a symbol.",
                };

                // ambil semua pesan yang gagal
                const failedMessages = (Object.keys(messages) as PasswordCheckKey[])
                    .filter((key) => !check[key])
                    .map((key) => messages[key]);

                if (failedMessages.length > 0) {
                    errorMsg = failedMessages;
                }
            }
            break;

        case "confirmPassword":
            if (!value) {
                errorMsg = "Please confirm your password.";
            } else if (!isPasswordMatch(form.password ?? "", value))
                errorMsg = "Password and confirmation do not match.";
            break;

        default:
            break;
    }

    return errorMsg;
};