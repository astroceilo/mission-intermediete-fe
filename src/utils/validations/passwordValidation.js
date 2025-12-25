export function isPasswordStrong(password: string) {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    return { minLength, hasUpper, hasLower, hasNumber, hasSymbol, isValid: minLength && hasUpper && hasLower && hasNumber && hasSymbol };
    // return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
}

export function isPasswordMatch(password: string, confirmPassword: string) {
    return password === confirmPassword;
}
