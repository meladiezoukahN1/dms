import { Suspense } from "react";
import { ArchivedCorrespondencePage } from "@/features/archive/archived-correspondence";

export default function ArchivedCorrespondenceRegistryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">جاري التحميل...</div>}>
      <ArchivedCorrespondencePage />
    </Suspense>
  );
}
