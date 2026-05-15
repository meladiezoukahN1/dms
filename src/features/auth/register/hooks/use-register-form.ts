"use client";

import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormSchemaType } from "../schemas/register.schema";
import { registerUser } from "../api/register.api";
import type { RegistrationError } from "../types";

/**
 * Hook for managing registration form state and submission
 */
export function useRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<RegistrationError | null>(null);

  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      accountType: "individual",
      organizationName: "",
    },
  });

  const onSubmit = async (data: RegisterFormSchemaType) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registerUser(data);

      if (result.error) {
        setError(result.error);
        
        // Set field errors if they exist
        if (result.error.fieldErrors) {
          Object.entries(result.error.fieldErrors).forEach(([field, messages]) => {
            const fieldPath = field as Path<RegisterFormSchemaType>;
            form.setError(fieldPath, {
              type: "server",
              message: messages[0],
            });
          });
        }
      } else if (result.data) {
        // Success - the page should redirect via route.ts response
        form.reset();
      }
    } catch {
      setError({
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitHandler = async (e?: BaseSyntheticEvent) => {
    await form.handleSubmit(onSubmit)(e);
  };

  return {
    form,
    isSubmitting,
    error,
    submitHandler,
  };
}
