import api from "@/lib/axios";
import { type UploadImageResponse } from "@/types/upload.types";

/**
 * POST /upload/image — multipart field `file` (jpg/jpeg/png/gif/webp, max 5MB on BE).
 */
export const uploadService = {
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadImageResponse>(
      "/upload/image",
      formData,
      {
        timeout: 120_000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        transformRequest: [
          (data, headers) => {
            if (data instanceof FormData) {
              delete headers["Content-Type"];
            }
            return data;
          },
        ],
      },
    );
    return response.data;
  },
};
