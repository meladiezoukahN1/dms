"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";

export function ForgotPasswordForm() {
  const { form, error, message, isSubmitting, onSubmit } = useForgotPasswordForm();

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">نسيت كلمة المرور</CardTitle>
          <CardDescription>سنرسل رمز تحقق مكون من 6 أرقام إلى بريدك الإلكتروني</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">البريد الإلكتروني</Label>
                  <Input id="forgot-email" type="email" inputMode="email" autoComplete="email" dir="ltr" {...field} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "جار الإرسال..." : "إرسال رمز التحقق"}
            </Button>

            <div className="text-sm text-muted-foreground">
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
