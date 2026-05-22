"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center p-6">
          <section className="w-full rounded-lg border border-border bg-card p-6 text-card-foreground space-y-4">
            <h1 className="text-xl font-semibold">حدث خطأ غير متوقع</h1>
            <p className="text-sm text-muted-foreground">
              تعذر تحميل الصفحة الآن. يمكنك إعادة المحاولة.
            </p>
            {error.digest ? (
              <p className="text-xs text-muted-foreground">رقم التتبع: {error.digest}</p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              إعادة المحاولة
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
