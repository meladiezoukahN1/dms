"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";
import { OtpInput } from "./otp-input";

export function ResetPasswordForm() {
  const { form, error, message, isSubmitting, onSubmit } = useResetPasswordForm();

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription>أدخل البريد الإلكتروني والرمز ثم كلمة المرور الجديدة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                  <Input id="reset-email" type="email" inputMode="email" autoComplete="email" dir="ltr" {...field} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="reset-otp">رمز التحقق</Label>
                  <OtpInput value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input id="new-password" type="password" autoComplete="new-password" dir="ltr" {...field} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input id="confirm-password" type="password" autoComplete="new-password" dir="ltr" {...field} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "جار تحديث كلمة المرور..." : "تحديث كلمة المرور"}
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
