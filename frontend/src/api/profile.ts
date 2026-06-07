import { api } from "./client";
import type { Profile } from "../types/profile";

export const profileApi = {
  get: () => api.get<Profile>("/profile"),
  put: (profile: Profile) => api.put<Profile>("/profile", profile),
};
