/**
 * Application routes and API endpoints
 */

export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    REGISTER: "/register",
  },
  DASHBOARD: {
    HOME: "/dashboard",
  },
} as const;

export const API_ROUTES = {
  V1: {
    AUTH: {
      LOGIN: "/api/auth/signin",
      REGISTER: "/api/v1/auth/register",
      FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
      VERIFY_RESET_OTP: "/api/v1/auth/verify-reset-otp",
      RESET_PASSWORD: "/api/v1/auth/reset-password",
      ME: "/api/v1/auth/me",
    },
  },
} as const;
