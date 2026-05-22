import { Suspense } from "react";
import { FinalArchivePage } from "@/features/archive/final-archive/components/final-archive-page";

export const metadata = {
  title: "الأرشفة النهائية - نظام إدارة المراسلات",
  description: "إدارة أرشفة المراسلات المحالة للأرشفة",
};

export default function FinalArchivePageRoute() {
  return (
    <Suspense fallback={null}>
      <FinalArchivePage />
    </Suspense>
  );
}
