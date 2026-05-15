"use client";

import { Input } from "@/components/ui";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  return (
    <Input
      id="reset-otp"
      value={value}
      onChange={(event) => {
        const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 6);
        onChange(digitsOnly);
      }}
      inputMode="numeric"
      autoComplete="one-time-code"
      placeholder="000000"
      maxLength={6}
      dir="ltr"
      disabled={disabled}
      aria-label="رمز التحقق"
    />
  );
}
