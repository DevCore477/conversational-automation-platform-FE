import api from "@/lib/axios";
import type { Blog } from "@/types/blog.types";

export const blogService = {
  findAll: async (): Promise<Blog[]> => {
    const response = await api.get<Blog[]>("/api/blogs");
    return response.data;
  },
};
