"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { RegisterFormSchemaType } from "../schemas/register.schema";

interface PasswordFieldProps {
  name: keyof Pick<RegisterFormSchemaType, "password" | "confirmPassword">;
  label: string;
  placeholder: string;
  showPasswordStrength?: boolean;
}

/**
 * Password input field component with optional strength indicator
 */
export function PasswordField({
  name,
  label,
  placeholder,
  showPasswordStrength = false,
}: PasswordFieldProps) {
  const { control, watch } = useFormContext<RegisterFormSchemaType>();
  const [showPassword, setShowPassword] = useState(false);
  const password = watch(name);

  const getPasswordStrength = (pwd: string): "weak" | "medium" | "strong" => {
    if (!pwd) return "weak";
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
  };

  const strength = showPasswordStrength ? getPasswordStrength(password) : null;
  const strengthColor = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };
  const strengthWidth = {
    weak: "w-1/3",
    medium: "w-2/3",
    strong: "w-full",
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">{label}</label>
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {showPasswordStrength && password && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strengthColor[strength!]} ${strengthWidth[strength!]} transition-all`}
                />
              </div>
              <span className="text-xs text-gray-600">
                {strength ? strength.charAt(0).toUpperCase() + strength.slice(1) : ""}
              </span>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
