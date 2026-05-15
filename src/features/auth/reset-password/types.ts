export interface ResetPasswordValues {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpValues {
  email: string;
  otp: string;
}
