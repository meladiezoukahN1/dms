/**
 * Template Renderer for DIGITAL_GENERATED Correspondence
 *
 * Renders correspondence data to HTML suitable for PDF generation.
 * Supports Arabic/RTL layout for official government correspondence.
 */

import type { Prisma } from "@prisma/client";

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function asRecord(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return {};
  }

  return value as Record<string, unknown>;
}

/**
 * Format date for Arabic display
 */
function formatArabicDate(date: Date | null | undefined): string {
  if (!date) return "";

  const formatter = new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(new Date(date));
}

/**
 * Format priority as Arabic label
 */
function getPriorityLabel(priority: string | null | undefined): string {
  const labels: Record<string, string> = {
    LOW: "منخفض",
    NORMAL: "عادي",
    HIGH: "مرتفع",
    URGENT: "عاجل",
  };

  return labels[priority || "NORMAL"] || "عادي";
}

/**
 * Format confidentiality as Arabic label
 */
function getConfidentialityLabel(
  confidentiality: string | null | undefined
): string {
  const labels: Record<string, string> = {
    INTERNAL: "داخلي",
    CONFIDENTIAL: "سري",
    SECRET: "سري جداً",
    TOP_SECRET: "سري للغاية",
    PUBLIC: "عام",
  };

  return labels[confidentiality || "INTERNAL"] || "داخلي";
}

/**
 * Format direction as Arabic label
 */
function getDirectionLabel(direction: string | null | undefined): string {
  const labels: Record<string, string> = {
    INCOMING: "وارد",
    OUTGOING: "صادر",
    INTERNAL: "داخلي",
  };

  return labels[direction || "INTERNAL"] || "داخلي";
}

/**
 * Render correspondence to HTML with Arabic/RTL support
 *
 * Generates official letter template suitable for PDF generation.
 * Includes header, metadata, body content, and footer.
 *
 * @param correspondence - Correspondence data to render
 * @returns HTML string ready for PDF generation
 */
export function renderCorrespondenceToHtml(
  correspondence: {
    id: string;
    referenceNumber: string | null;
    title: string;
    subject: string | null;
    body: string | null;
    priority?: string | null;
    confidentiality?: string | null;
    direction: string;
    correspondenceDate?: Date | null;
    formData: Prisma.JsonValue | null;
  }
): string {
  const formData = asRecord(correspondence.formData);
  const title = escapeHtml(correspondence.title);
  const subject = escapeHtml(correspondence.subject || "-");
  const body = escapeHtml(correspondence.body);
  const referenceNo = escapeHtml(
    cleanText(correspondence.referenceNumber) || cleanText(formData.referenceDisplay) || correspondence.id
  );
  const correspondenceDate = formatArabicDate(correspondence.correspondenceDate);
  const previewDate = correspondenceDate || "—";
  const priority = getPriorityLabel(correspondence.priority);
  const confidentiality = getConfidentialityLabel(correspondence.confidentiality);
  const direction = getDirectionLabel(correspondence.direction);
  const recipientTitle = escapeHtml(cleanText(formData.recipientTitle) || "السادة");
  const recipientName = escapeHtml(cleanText(formData.recipientName) || "الجهة المستقبلة");
  const receiverDisplay = escapeHtml(cleanText(formData.receiverDisplayName) || "الإدارة/القسم المستلم");
  const senderDisplay = escapeHtml(cleanText(formData.senderDisplayName) || "الجهة المرسلة");
  const signatureName = escapeHtml(cleanText(formData.signatureName) || "الاسم");
  const signatureTitle = escapeHtml(cleanText(formData.signatureTitle) || "الصفة");
  const footerLocation = escapeHtml(cleanText(formData.footerLocation) || "الموقع/العنوان");
  const documentIntro = escapeHtml(cleanText(formData.documentIntro) || "تحية طيبة وبعد،");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

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
      background: var(--doc-paper);
      color: var(--doc-ink);
      line-height: 1.6;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background-color: var(--doc-paper);
      padding: 16mm 18mm 14mm;
      border: 1px solid var(--doc-line);
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
      .metadata {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      body {
        background: var(--doc-paper);
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        border: none;
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
      <div>تم توليد هذه الوثيقة رقمياً عبر نظام إدارة المراسلات.</div>
    </div>
  </div>
</body>
</html>`;
}
