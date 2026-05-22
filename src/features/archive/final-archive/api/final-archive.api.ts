import type {
  FinalArchiveListResponseDto,
  UpdateFinalArchiveResponseDto,
  ArchiveCorrespondenceResponseDto,
  UpdateFinalArchivePayload,
  ArchiveCorrespondencePayload,
  FinalArchiveQueryState,
} from "../types";
import { appFetch } from "@/lib/api-client";

export class FinalArchiveAPI {
  private static readonly baseURL = "/api/v1/archive/final-archive";

  static async getFinalArchiveList(
    query: FinalArchiveQueryState
  ): Promise<FinalArchiveListResponseDto> {
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

    const response = await appFetch(`${this.baseURL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch final archive list: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  }

  static async updateCorrespondence(
    id: string,
    payload: UpdateFinalArchivePayload
  ): Promise<UpdateFinalArchiveResponseDto> {
    const response = await appFetch(`${this.baseURL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update correspondence: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  }

  static async archiveCorrespondence(
    id: string,
    payload: ArchiveCorrespondencePayload
  ): Promise<ArchiveCorrespondenceResponseDto> {
    const response = await appFetch(`${this.baseURL}/${id}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to archive correspondence: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  }

  static getPreviewUrl(fileId: string): string {
    return `${this.baseURL}/files/${fileId}/preview`;
  }

  static getDownloadUrl(fileId: string): string {
    return `${this.baseURL}/files/${fileId}/download`;
  }
}
