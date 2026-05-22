import type {
  ArchivedCorrespondenceDetail,
  ArchivedCorrespondenceListResponse,
  ArchivedCorrespondenceQueryState,
} from "../types";
import { appFetch } from "@/lib/api-client";

const BASE_URL = "/api/v1/archive/archived-correspondence";

export class ArchivedCorrespondenceAPI {
  static async getList(
    query: ArchivedCorrespondenceQueryState
  ): Promise<ArchivedCorrespondenceListResponse> {
    const params = new URLSearchParams();
    params.append("page", query.page.toString());
    params.append("pageSize", query.pageSize.toString());
    if (query.search) params.append("search", query.search);
    if (query.sourceType) params.append("sourceType", query.sourceType);
    if (query.direction) params.append("direction", query.direction);
    if (query.priority) params.append("priority", query.priority);
    if (query.confidentiality) params.append("confidentiality", query.confidentiality);
    if (query.dateFrom) params.append("dateFrom", query.dateFrom);
    if (query.dateTo) params.append("dateTo", query.dateTo);
    if (query.archiveDateFrom) params.append("archiveDateFrom", query.archiveDateFrom);
    if (query.archiveDateTo) params.append("archiveDateTo", query.archiveDateTo);

    const response = await appFetch(`${BASE_URL}?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`فشل في تحميل سجل المراسلات المؤرشفة: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  }

  static async getDetail(id: string): Promise<ArchivedCorrespondenceDetail> {
    const response = await appFetch(`${BASE_URL}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`فشل في تحميل تفاصيل المراسلة: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  }

  static getPreviewUrl(fileId: string): string {
    return `${BASE_URL}/files/${fileId}/preview`;
  }

  static getDownloadUrl(fileId: string): string {
    return `${BASE_URL}/files/${fileId}/download`;
  }
}
