"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { form, error, isSubmitting, onSubmit } = useLoginForm();

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بيانات الحساب للوصول إلى النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <Input id="login-email" type="email" inputMode="email" autoComplete="email" dir="ltr" {...field} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <Input id="login-password" type="password" autoComplete="current-password" dir="ltr" {...field} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "جار تسجيل الدخول..." : "دخول"}
            </Button>

            <div className="text-sm text-muted-foreground">
              <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
