"use client";
import type { BaseSyntheticEvent } from "react";
import { FormProvider, useFormContext, Controller } from "react-hook-form";
import { useRegisterForm } from "../hooks/use-register-form";
import { PasswordField } from "./password-field";
import { AccountTypeSelect } from "./account-type-select";
import type { RegisterFormSchemaType } from "../schemas/register.schema";

interface RegisterFormContentProps {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
}

/**
 * Internal form content component
 */
function RegisterFormContent({
  isSubmitting,
  error,
  onSubmit,
}: RegisterFormContentProps) {
  const { control, formState: { errors }, watch } = useFormContext<RegisterFormSchemaType>();
  const accountType = watch("accountType");

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <input
              {...field}
              type="email"
              placeholder="you@example.com"
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        )}
      />

      {/* Full Name Field */}
      <Controller
        control={control}
        name="fullName"
        render={({ field }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Full Name</label>
            <input
              {...field}
              type="text"
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
        )}
      />

      {/* Account Type */}
      <AccountTypeSelect />

      {/* Organization Name (conditional) */}
      {accountType === "organization" && (
        <Controller
          control={control}
          name="organizationName"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Organization Name
              </label>
              <input
                {...field}
                type="text"
                placeholder="Your Company"
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.organizationName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isSubmitting}
              />
              {errors.organizationName && (
                <p className="text-sm text-red-500">
                  {errors.organizationName.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      {/* Password Field */}
      <PasswordField
        name="password"
        label="Password"
        placeholder="••••••••"
        showPasswordStrength={true}
      />

      {/* Confirm Password Field */}
      <PasswordField
        name="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}

/**
 * Main registration form component
 */
export function RegisterForm() {
  const registerForm = useRegisterForm();

  return (
    <FormProvider {...registerForm.form}>
      <RegisterFormContent
        isSubmitting={registerForm.isSubmitting}
        error={registerForm.error?.message ?? null}
        onSubmit={registerForm.submitHandler}
      />
    </FormProvider>
  );
}
