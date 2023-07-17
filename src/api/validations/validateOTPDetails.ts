// Validates if all required data are provided for otp verification.
export const validateOTPDetails = (userId:number, otp:string) => {
    if (!userId || !otp) return {
        success: false,
        message: 'User-ID or OTP missing!'
    };

    return {
        success: true,
        message: 'OTP details verified!'
    };
}