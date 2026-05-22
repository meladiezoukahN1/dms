export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center p-6" dir="rtl">
      <section className="w-full rounded-lg border border-border bg-card p-6 text-card-foreground space-y-4">
        <h1 className="text-2xl font-semibold">404 - الصفحة غير موجودة</h1>
        <p className="text-sm text-muted-foreground">
          الرابط المطلوب غير متاح أو تم نقله.
        </p>
        <a
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          العودة إلى لوحة التحكم
        </a>
      </section>
    </main>
  );
}
