import { apiClient } from "@/lib/utils/apiClient";
import type { User, UpdateUserRequest, UpdateSkillsRequest } from "@/lib/types/user";

export const userApi = {
  getMe(): Promise<User> {
    return apiClient.get("/users/me");
  },
  updateMe(payload: UpdateUserRequest): Promise<User> {
    return apiClient.put("/users/me", payload);
  },
  updateSkills(payload: UpdateSkillsRequest): Promise<UpdateSkillsRequest> {
    return apiClient.put("/users/me/skills", payload);
  },
};
