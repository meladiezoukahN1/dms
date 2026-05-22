"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { updateArchiveHandoverSchema } from "../schemas/archive-handover.schema";
import { useUpdateArchiveHandoverCorrespondence } from "../hooks/use-update-archive-handover-correspondence";
import { isApiClientError, type ArchiveHandoverItemDto, type UpdateArchiveHandoverPayload } from "../types";

interface EditHandoverCorrespondenceDialogProps {
  open: boolean;
  item: ArchiveHandoverItemDto | null;
  onClose: () => void;
}

interface FormState {
  title: string;
  referenceNumber: string;
  subject: string;
  direction: "INCOMING" | "OUTGOING" | "INTERNAL";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  confidentiality: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET" | "TOP_SECRET";
  correspondenceDate: string;
  senderDepartmentId: string;
  receiverDepartmentId: string;
  senderEntityId: string;
  receiverEntityId: string;
  notes: string;
}

function toDateInput(isoDate: string | null): string {
  if (!isoDate) {
    return "";
  }

  return isoDate.slice(0, 10);
}

function createInitialForm(item: ArchiveHandoverItemDto): FormState {
  return {
    title: item.title,
    referenceNumber: item.referenceNumber || "",
    subject: item.subject || "",
    direction: item.direction,
    priority: item.priority,
    confidentiality: item.confidentiality,
    correspondenceDate: toDateInput(item.correspondenceDate),
    senderDepartmentId: "",
    receiverDepartmentId: "",
    senderEntityId: "",
    receiverEntityId: "",
    notes: "",
  };
}

function createEmptyForm(): FormState {
  return {
    title: "",
    referenceNumber: "",
    subject: "",
    direction: "INCOMING",
    priority: "NORMAL",
    confidentiality: "INTERNAL",
    correspondenceDate: "",
    senderDepartmentId: "",
    receiverDepartmentId: "",
    senderEntityId: "",
    receiverEntityId: "",
    notes: "",
  };
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function EditHandoverCorrespondenceDialog({
  open,
  item,
  onClose,
}: EditHandoverCorrespondenceDialogProps) {
  const updateMutation = useUpdateArchiveHandoverCorrespondence();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(() => (item ? createInitialForm(item) : createEmptyForm()));

  if (!open || !item) {
    return null;
  }

  const selectedItem = item;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]): void {
    setForm((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  }

  async function onSubmit(): Promise<void> {
    setError(null);

    const parsed = updateArchiveHandoverSchema.safeParse(form);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      setError(firstIssue || "البيانات غير صالحة");
      return;
    }

    const payload: UpdateArchiveHandoverPayload = {
      title: parsed.data.title,
      referenceNumber: parsed.data.referenceNumber || null,
      subject: parsed.data.subject || null,
      direction: parsed.data.direction,
      priority: parsed.data.priority,
      confidentiality: parsed.data.confidentiality,
      correspondenceDate: parsed.data.correspondenceDate || null,
      senderDepartmentId: parsed.data.senderDepartmentId || null,
      receiverDepartmentId: parsed.data.receiverDepartmentId || null,
      senderEntityId: parsed.data.senderEntityId || null,
      receiverEntityId: parsed.data.receiverEntityId || null,
      notes: parsed.data.notes || null,
    };

    try {
      await updateMutation.mutateAsync({ id: selectedItem.id, payload });
      onClose();
    } catch (mutationError) {
      if (isApiClientError(mutationError)) {
        setError(mutationError.message);
        return;
      }

      setError("تعذر تحديث بيانات المراسلة");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">تعديل بيانات المراسلة قبل الإحالة</CardTitle>
          <Button type="button" variant="ghost" onClick={onClose}>
            إغلاق
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <h3 className="mb-2 text-sm font-semibold text-foreground">الملفات المرتبطة</h3>
            {selectedItem.files.length === 0 ? (
              <p className="text-xs text-muted-foreground">لا توجد ملفات مرتبطة.</p>
            ) : (
              <div className="space-y-2">
                {selectedItem.files.map((file) => (
                  <div key={file.id} className="rounded-md border border-border bg-card p-2 text-xs">
                    <p className="font-medium text-foreground">{file.originalName}</p>
                    <p className="text-muted-foreground">{file.mimeType} · {formatBytes(file.sizeBytes)}</p>
                    <p className="text-muted-foreground">الغرض: {file.purpose}</p>
                    {file.urlAvailable && file.safeUrl ? (
                      <a href={file.safeUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                        فتح الملف
                      </a>
                    ) : (
                      <p className="text-muted-foreground">يتطلب رابط عرض آمن</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input value={form.title} onChange={(event) => setField("title", event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>الرقم الإشاري</Label>
              <Input
                value={form.referenceNumber}
                onChange={(event) => setField("referenceNumber", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>الموضوع</Label>
              <Input value={form.subject} onChange={(event) => setField("subject", event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>التاريخ</Label>
              <Input
                type="date"
                value={form.correspondenceDate}
                onChange={(event) => setField("correspondenceDate", event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>الاتجاه</Label>
              <select
                aria-label="الاتجاه"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                value={form.direction}
                onChange={(event) => setField("direction", event.target.value as FormState["direction"])}
              >
                <option value="INCOMING">وارد</option>
                <option value="OUTGOING">صادر</option>
                <option value="INTERNAL">داخلي</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>الأولوية</Label>
              <select
                aria-label="الأولوية"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                value={form.priority}
                onChange={(event) => setField("priority", event.target.value as FormState["priority"])}
              >
                <option value="LOW">منخفضة</option>
                <option value="NORMAL">عادية</option>
                <option value="HIGH">مرتفعة</option>
                <option value="URGENT">عاجلة</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>السرية</Label>
              <select
                aria-label="السرية"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                value={form.confidentiality}
                onChange={(event) =>
                  setField("confidentiality", event.target.value as FormState["confidentiality"])
                }
              >
                <option value="PUBLIC">عام</option>
                <option value="INTERNAL">داخلي</option>
                <option value="CONFIDENTIAL">سري</option>
                <option value="SECRET">سري جدًا</option>
                <option value="TOP_SECRET">سري للغاية</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>معرف الإدارة المرسلة</Label>
              <Input
                value={form.senderDepartmentId}
                onChange={(event) => setField("senderDepartmentId", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>معرف الإدارة المستقبلة</Label>
              <Input
                value={form.receiverDepartmentId}
                onChange={(event) => setField("receiverDepartmentId", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>معرف الجهة المرسلة</Label>
              <Input
                value={form.senderEntityId}
                onChange={(event) => setField("senderEntityId", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>معرف الجهة المستقبلة</Label>
              <Input
                value={form.receiverEntityId}
                onChange={(event) => setField("receiverEntityId", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>ملاحظات</Label>
            <textarea
              aria-label="ملاحظات"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="button" onClick={onSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "جار الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
