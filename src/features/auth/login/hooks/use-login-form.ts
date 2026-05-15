"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginSchemaType } from "../schemas/login.schema";

export function useLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("بيانات الدخول غير صحيحة");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  });

  return {
    form,
    isSubmitting,
    error,
    onSubmit,
  };
}
