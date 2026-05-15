"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestForgotPassword } from "../api/forgot-password.api";
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "../schemas/forgot-password.schema";

export function useForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const result = await requestForgotPassword({ email: values.email.trim().toLowerCase() });
      setMessage(result.message);
    } catch {
      setError("تعذر تنفيذ الطلب حالياً");
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    message,
    error,
    isSubmitting,
    onSubmit,
  };
}
