"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { useSendToArchive } from "../hooks/use-send-to-archive";
import { isApiClientError } from "../types";

interface SendToArchiveActionProps {
  correspondenceId: string;
}

export function SendToArchiveAction({ correspondenceId }: SendToArchiveActionProps) {
  const sendMutation = useSendToArchive();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [targetDepartmentId, setTargetDepartmentId] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSend(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setError(null);

    try {
      await sendMutation.mutateAsync({
        id: correspondenceId,
        payload: {
          targetDepartmentId: targetDepartmentId.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });

      setOpen(false);
      setNotes("");
      setTargetDepartmentId("");
    } catch (sendError) {
      if (isApiClientError(sendError)) {
        setError(sendError.message);
        return;
      }

      setError("تعذر تنفيذ الإحالة للأرشفة");
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => setOpen(true)}
        aria-label="إحالة المراسلة للأرشفة"
        title="إحالة للأرشفة"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4z" />
        </svg>
        <span className="sr-only">إحالة للأرشفة</span>
      </Button>

      {!open ? null : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-5 text-card-foreground shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">تأكيد الإحالة للأرشفة</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
                title="إغلاق"
              >
                ×
              </Button>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              سيتم تغيير حالة المراسلة إلى بانتظار الأرشفة.
            </p>

            <form onSubmit={onSend} className="space-y-3">
              <div className="space-y-2">
                <Label>الإدارة المستهدفة (اختياري)</Label>
                <Input
                  value={targetDepartmentId}
                  onChange={(event) => setTargetDepartmentId(event.target.value)}
                  placeholder="معرف الإدارة"
                />
              </div>

              <div className="space-y-2">
                <Label>ملاحظات الإحالة (اختياري)</Label>
                <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="ملاحظات" />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={sendMutation.isPending}>
                  {sendMutation.isPending ? "جار الإرسال..." : "تأكيد الإحالة"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
