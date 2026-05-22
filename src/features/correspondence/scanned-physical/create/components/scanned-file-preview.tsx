"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

interface ScannedFilePreviewProps {
  file: File | null | undefined;
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function ScannedFilePreview({ file }: ScannedFilePreviewProps) {
  const localUrl = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
      }
    };
  }, [localUrl]);

  const fileKind = useMemo(() => {
    if (!file) return "none";
    if (file.type === "application/pdf") return "pdf";
    if (file.type.startsWith("image/")) return "image";
    return "other";
  }, [file]);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">رفع ملف ممسوح</CardTitle>
        <CardDescription>
          معاينة محلية قبل الحفظ. لن يتم رفع الملف إلى الخادم قبل الضغط على حفظ.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!file ? (
          <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            لم يتم اختيار ملف بعد.
          </div>
        ) : (
          <>
            <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-foreground space-y-1">
              <p><span className="text-muted-foreground">الاسم:</span> {file.name}</p>
              <p><span className="text-muted-foreground">النوع:</span> {file.type || "غير معروف"}</p>
              <p><span className="text-muted-foreground">الحجم:</span> {formatBytes(file.size)}</p>
              <p className="text-xs text-muted-foreground">معاينة محلية قبل الحفظ</p>
            </div>

            {localUrl && fileKind === "image" ? (
              <div className="overflow-hidden rounded-lg border border-border bg-muted/20 p-2">
                <Image
                  src={localUrl}
                  alt="معاينة محلية قبل الحفظ"
                  width={1200}
                  height={900}
                  unoptimized
                  className="max-h-105 w-full object-contain"
                />
              </div>
            ) : null}

            {localUrl && fileKind === "pdf" ? (
              <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                <iframe
                  title="معاينة PDF محلية قبل الحفظ"
                  src={localUrl}
                  className="h-105 w-full bg-background"
                />
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
