import { api } from "./client";
import type { Job, JobCreate } from "../types/job";

export const jobsApi = {
  list: () => api.get<Job[]>("/jobs"),
  create: (job: JobCreate) => api.post<Job>("/jobs", job),
  patch: (id: number, patch: Partial<Job>) => api.patch<Job>(`/jobs/${id}`, patch),
  remove: (id: number) => api.del(`/jobs/${id}`),

  scrape: () => api.post<{ ok: boolean; action: string; found: number }>("/jobs/scrape"),
  generateCv: (id: number) => api.post<{ ok: boolean }>(`/jobs/${id}/generate-cv`),
  generateCoverLetter: (id: number) => api.post<{ ok: boolean }>(`/jobs/${id}/generate-cover-letter`),
  verify: (id: number) => api.post<{ ok: boolean }>(`/jobs/${id}/verify`),
  submit: (id: number) => api.post<{ ok: boolean }>(`/jobs/${id}/submit`),
  sendEmail: (id: number) => api.post<{ ok: boolean }>(`/jobs/${id}/send-email`),
};
