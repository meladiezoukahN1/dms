"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { Button, Input, Label } from "@/components/ui";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { form, error, isSubmitting, onSubmit } = useLoginForm();

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Form side */}
        <section className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-10 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                نظام إدارة الوثائق
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                تسجيل الدخول
              </h1>

              <p className="text-sm leading-7 text-muted-foreground">
                أدخل بيانات الحساب للوصول إلى لوحة إدارة المراسلات والوثائق.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="login-email">البريد الإلكتروني</Label>

                    <Input
                      id="login-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      dir="ltr"
                      className="h-12"
                      {...field}
                    />

                    {fieldState.error ? (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="login-password">كلمة المرور</Label>

                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      dir="ltr"
                      className="h-12"
                      {...field}
                    />

                    {fieldState.error ? (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />

              {error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
                {isSubmitting ? "جار تسجيل الدخول..." : "دخول"}
              </Button>

              <div className="text-sm text-muted-foreground">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </form>
          </div>
        </section>

        {/* Visual side */}
        <section className="relative hidden min-h-screen overflow-hidden bg-primary lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_42%)]" />

          <div className="relative flex h-full flex-col justify-between p-16 text-primary-foreground">
            <div className="space-y-3">
              <p className="text-sm font-medium opacity-80">
                DMS
              </p>

              <h2 className="max-w-lg text-4xl font-bold leading-tight">
                منصة موحدة لإدارة الوثائق والمراسلات الداخلية.
              </h2>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm leading-7 opacity-90">
                  أرشفة منظمة، صلاحيات واضحة، وتتبع كامل لحركة الملفات داخل النظام.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-bold">01</p>
                  <p className="mt-2 text-xs opacity-80">إدارة الوثائق</p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-bold">02</p>
                  <p className="mt-2 text-xs opacity-80">المراسلات</p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-bold">03</p>
                  <p className="mt-2 text-xs opacity-80">الصلاحيات</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}