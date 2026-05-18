import type { CreatedDigitalCorrespondenceDto, DigitalCorrespondenceFormValues } from "../types";

function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function formatArabicDate(date: Date | null | undefined): string {
  if (!date) return "";

  const formatter = new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(new Date(date));
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim();
  return normalized;
}

function getPriorityLabel(priority: string | null | undefined): string {
  const labels: Record<string, string> = {
    LOW: "منخفض",
    NORMAL: "عادي",
    HIGH: "مرتفع",
    URGENT: "عاجل",
  };

  return labels[priority || "NORMAL"] || "عادي";
}

function getConfidentialityLabel(confidentiality: string | null | undefined): string {
  const labels: Record<string, string> = {
    INTERNAL: "داخلي",
    CONFIDENTIAL: "سري",
    SECRET: "غاية السرية",
    TOP_SECRET: "سري للغاية",
    PUBLIC: "عام",
  };

  return labels[confidentiality || "INTERNAL"] || "داخلي";
}

function getDirectionLabel(direction: string | null | undefined): string {
  const labels: Record<string, string> = {
    INCOMING: "وارد",
    OUTGOING: "صادر",
    INTERNAL: "داخلي",
  };

  return labels[direction || "INTERNAL"] || "داخلي";
}

export function renderFinalPreviewHtml(
  values: DigitalCorrespondenceFormValues,
  createdDraft: CreatedDigitalCorrespondenceDto | null
): string {
  const formData = (values.formData ?? {}) as Record<string, unknown>;
  const title = escapeHtml(values.title || "مراسلة رسمية");
  const subject = escapeHtml(values.subject || "-");
  const body = escapeHtml(values.body || "");
  const referenceNo = escapeHtml(
    cleanText(values.referenceNumber) ||
      cleanText(formData.referenceDisplay) ||
      createdDraft?.id ||
      "مسودة غير مرقمة"
  );
  const correspondenceDate = values.correspondenceDate
    ? formatArabicDate(new Date(values.correspondenceDate))
    : "";
  const previewDate = correspondenceDate || "—";
  const priority = getPriorityLabel(values.priority);
  const confidentiality = getConfidentialityLabel(values.confidentiality);
  const direction = getDirectionLabel(values.direction);
  const recipientTitle = escapeHtml(cleanText(values.recipientTitle) || cleanText(formData.recipientTitle) || "السادة");
  const recipientName = escapeHtml(cleanText(values.recipientName) || cleanText(formData.recipientName) || "الجهة المستقبلة");
  const receiverDisplay = escapeHtml(
    cleanText(values.receiverDisplayName) || cleanText(formData.receiverDisplayName) || "الإدارة/القسم المستلم"
  );
  const senderDisplay = escapeHtml(cleanText(values.senderDisplayName) || cleanText(formData.senderDisplayName) || "الجهة المرسلة");
  const signatureName = escapeHtml(cleanText(values.signatureName) || cleanText(formData.signatureName) || "الاسم");
  const signatureTitle = escapeHtml(cleanText(values.signatureTitle) || cleanText(formData.signatureTitle) || "الصفة");
  const footerLocation = escapeHtml(cleanText(values.footerLocation) || cleanText(formData.footerLocation) || "الموقع/العنوان");
  const documentIntro = escapeHtml(cleanText(values.documentIntro) || cleanText(formData.documentIntro) || "تحية طيبة وبعد،");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --doc-paper: hsl(0 0% 100%);
      --doc-ink: hsl(220 15% 20%);
      --doc-subtle: hsl(220 9% 36%);
      --doc-line: hsl(220 14% 78%);
      --doc-soft: hsl(40 25% 97%);
      --doc-accent: hsl(201 44% 31%);
      --doc-accent-soft: hsl(201 36% 95%);
    }

    body {
      font-family: "Tahoma", "Arial", sans-serif;
      direction: rtl;
      text-align: right;
      unicode-bidi: isolate;
      background: linear-gradient(180deg, hsl(36 22% 95%) 0%, hsl(35 22% 92%) 100%);
      color: var(--doc-ink);
      line-height: 1.6;
      padding: 14px;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background-color: var(--doc-paper);
      padding: 16mm 18mm 14mm;
      border: 1px solid var(--doc-line);
      box-shadow: 0 10px 24px hsl(220 8% 12% / 0.12);
    }

    .header {
      border-bottom: 2px solid var(--doc-line);
      padding-bottom: 8mm;
      margin-bottom: 8mm;
    }

    .identity-mark {
      text-align: center;
      font-size: 10pt;
      color: var(--doc-subtle);
      margin-bottom: 2mm;
      letter-spacing: 0.4px;
    }

    .header-title {
      font-size: 17pt;
      font-weight: 700;
      color: var(--doc-accent);
      margin-bottom: 2mm;
      text-align: center;
    }

    .header-subtitle {
      font-size: 10pt;
      color: var(--doc-subtle);
      text-align: center;
      margin-bottom: 1mm;
    }

    .draft-chip {
      width: fit-content;
      margin: 4mm auto 0;
      border: 1px dashed var(--doc-line);
      background: var(--doc-soft);
      color: var(--doc-subtle);
      padding: 1.5mm 4mm;
      font-size: 9pt;
      border-radius: 999px;
    }

    .metadata {
      background: var(--doc-soft);
      border: 1px solid var(--doc-line);
      border-radius: 2mm;
      padding: 5mm;
      margin-bottom: 7mm;
      font-size: 10pt;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5mm 5mm;
    }

    .metadata-row {
      display: flex;
      align-items: baseline;
      gap: 2mm;
      direction: rtl;
      unicode-bidi: isolate;
    }

    .metadata-label {
      font-weight: 700;
      color: var(--doc-accent);
      min-width: 22mm;
    }

    .metadata-value {
      color: var(--doc-ink);
      text-align: right;
      flex: 1;
    }

    .ltr {
      direction: ltr;
      unicode-bidi: isolate;
      display: inline-block;
      text-align: left;
    }

    .recipient-block {
      border: 1px solid var(--doc-line);
      border-right: 3px solid var(--doc-accent);
      border-radius: 2mm;
      padding: 4mm 5mm;
      margin-bottom: 6mm;
      background: var(--doc-paper);
    }

    .block-title {
      font-size: 10pt;
      font-weight: 700;
      color: var(--doc-accent);
      margin-bottom: 2.5mm;
    }

    .recipient-line {
      font-size: 11pt;
      color: var(--doc-ink);
      line-height: 1.9;
      direction: rtl;
      text-align: right;
      unicode-bidi: isolate;
    }

    .subject {
      background: var(--doc-accent-soft);
      border-right: 4px solid var(--doc-accent);
      border-radius: 2mm;
      padding: 4mm 5mm;
      margin-bottom: 6mm;
    }

    .subject-label {
      font-size: 10pt;
      color: var(--doc-accent);
      font-weight: 700;
      margin-bottom: 2mm;
    }

    .subject-text {
      font-size: 11pt;
      color: var(--doc-ink);
      font-weight: 500;
      line-height: 1.8;
      direction: rtl;
      text-align: right;
      unicode-bidi: isolate;
    }

    .intro {
      font-size: 11pt;
      color: var(--doc-ink);
      margin-bottom: 4mm;
      line-height: 1.9;
      direction: rtl;
      text-align: right;
      unicode-bidi: isolate;
    }

    .body {
      font-size: 11pt;
      line-height: 2;
      color: var(--doc-ink);
      margin-bottom: 8mm;
      text-align: right;
      direction: rtl;
      unicode-bidi: isolate;
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 50mm;
    }

    .closing {
      margin-top: 5mm;
      margin-bottom: 7mm;
      font-size: 11pt;
      color: var(--doc-ink);
      line-height: 1.9;
      direction: rtl;
      text-align: right;
      unicode-bidi: isolate;
    }

    .signature {
      margin-top: 4mm;
      margin-right: auto;
      width: 72mm;
      border-top: 1px solid var(--doc-line);
      padding-top: 4mm;
    }

    .signature-line {
      font-size: 10.5pt;
      line-height: 1.9;
      color: var(--doc-ink);
      direction: rtl;
      text-align: right;
      unicode-bidi: isolate;
    }

    .footer {
      border-top: 1px solid var(--doc-line);
      padding-top: 4mm;
      margin-top: 10mm;
      color: var(--doc-subtle);
      font-size: 9pt;
      text-align: center;
      line-height: 1.8;
      direction: rtl;
      unicode-bidi: isolate;
    }

    .footer-location {
      color: var(--doc-ink);
      font-size: 9.5pt;
      margin-bottom: 1mm;
    }

    @media (max-width: 960px) {
      body {
        padding: 8px;
      }

      .page {
        width: 100%;
        min-height: auto;
        padding: 10mm;
      }

      .metadata {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      body {
        background: var(--doc-paper);
        padding: 0;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        border: none;
        box-shadow: none;
        margin: 0;
      }
    }

    @page {
      size: A4;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="identity-mark">[هوية المؤسسة / الشعار]</div>
      <div class="header-title">المؤسسة العامة للمراسلات</div>
      <div class="header-subtitle">مركز الاتصالات الإدارية</div>
      <div class="draft-chip">معاينة غير نهائية</div>
    </div>

    <div class="metadata">
      <div class="metadata-row">
        <div class="metadata-label">التاريخ:</div>
        <div class="metadata-value"><span class="ltr">${previewDate}</span></div>
      </div>
      <div class="metadata-row">
        <div class="metadata-label">الرقم الإشاري:</div>
        <div class="metadata-value"><span class="ltr">${referenceNo}</span></div>
      </div>
      <div class="metadata-row">
        <div class="metadata-label">نوع المراسلة:</div>
        <div class="metadata-value">${direction}</div>
      </div>
      <div class="metadata-row">
        <div class="metadata-label">السرية:</div>
        <div class="metadata-value">${confidentiality}</div>
      </div>
      <div class="metadata-row">
        <div class="metadata-label">الأولوية:</div>
        <div class="metadata-value">${priority}</div>
      </div>
    </div>

    <div class="recipient-block">
      <div class="block-title">بيانات الجهة المستقبلة</div>
      <div class="recipient-line">${recipientTitle} / ${recipientName}</div>
      <div class="recipient-line">${receiverDisplay}</div>
      <div class="recipient-line">الجهة المرسلة: ${senderDisplay}</div>
    </div>

    <div class="subject">
      <div class="subject-label">الموضوع</div>
      <div class="subject-text">${subject}</div>
    </div>

    <div class="intro">${documentIntro}</div>

    <div class="body">${body || "يرجى إدخال متن المراسلة الرسمية هنا بصياغة عربية واضحة."}</div>

    <div class="closing">وتفضلوا بقبول فائق الاحترام والتقدير.</div>

    <div class="signature">
      <div class="signature-line">الاسم: ${signatureName}</div>
      <div class="signature-line">الصفة: ${signatureTitle}</div>
      <div class="signature-line">التوقيع: ____________________</div>
    </div>

    <div class="footer">
      <div class="footer-location">${footerLocation}</div>
      <div>جهة الاتصال: ${senderDisplay}</div>
      <div><span class="ltr">${referenceNo}</span> :الرقم الإشاري</div>
      <div>هذه المعاينة مخصصة للمراجعة قبل الحفظ والتوليد.</div>
    </div>
  </div>
</body>
</html>`;
}
