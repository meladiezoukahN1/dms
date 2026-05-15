"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchemaType } from "../schemas/reset-password.schema";
import { submitResetPassword, verifyResetOtp } from "../api/reset-password.api";

export function useResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const validOtp = await verifyResetOtp({
        email: values.email.trim().toLowerCase(),
        otp: values.otp,
      });

      if (!validOtp) {
        setError("رمز التحقق غير صالح أو منتهي");
        return;
      }

      const result = await submitResetPassword({
        email: values.email.trim().toLowerCase(),
        otp: values.otp,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      setMessage(result);
      form.reset();
    } catch {
      setError("تعذر إعادة تعيين كلمة المرور");
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    error,
    message,
    isSubmitting,
    onSubmit,
  };
}
