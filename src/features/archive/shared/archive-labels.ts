export function getArchiveSourceTypeLabel(value: string): string {
  const map: Record<string, string> = {
    DIGITAL_GENERATED: "مراسلة رقمية",
    SCANNED_PHYSICAL: "مراسلة ممسوحة",
  };
  return map[value] || value;
}

export function getArchiveStatusLabel(value: string): string {
  const map: Record<string, string> = {
    DRAFT: "مسودة",
    GENERATED: "مولدة",
    RECEIVED: "مستلمة",
    ARCHIVE_PENDING: "بانتظار الأرشفة",
    ARCHIVED: "مؤرشفة",
  };
  return map[value] || value;
}

export function getArchiveDirectionLabel(value: string): string {
  const map: Record<string, string> = {
    INCOMING: "وارد",
    OUTGOING: "صادر",
    INTERNAL: "داخلي",
  };
  return map[value] || value;
}

export function getArchivePriorityLabel(value: string): string {
  const map: Record<string, string> = {
    LOW: "منخفضة",
    NORMAL: "عادية",
    HIGH: "عالية",
    URGENT: "عاجلة",
  };
  return map[value] || value;
}

export function getArchiveConfidentialityLabel(value: string): string {
  const map: Record<string, string> = {
    PUBLIC: "عامة",
    INTERNAL: "داخلية",
    CONFIDENTIAL: "سرية",
    SECRET: "سرية جدا",
    TOP_SECRET: "سرية للغاية",
  };
  return map[value] || value;
}

export function getArchiveFilePurposeLabel(value: string): string {
  const map: Record<string, string> = {
    GENERATED_PDF: "ملف PDF مولد",
    SCANNED_DOCUMENT: "مستند ممسوح",
    ATTACHMENT: "مرفق",
  };
  return map[value] || value;
}

export function formatArchiveFileSize(bytes: number): string {
  if (bytes === 0) return "0 بايت";
  const k = 1024;
  const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
