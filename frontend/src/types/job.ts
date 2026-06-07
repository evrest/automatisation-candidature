export type JobStatus =
  | "found"
  | "cv_generated"
  | "reviewed"
  | "submitted"
  | "responded"
  | "rejected";

export interface Job {
  id: number;
  title: string;
  company: string;
  source: string;
  url?: string | null;
  location?: string | null;
  contractType?: string | null;
  salary?: string | null;
  description?: string | null;
  requirements: string[];
  keywords: string[];
  status: JobStatus;
  cvPath?: string | null;
  coverLetterPath?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
  foundAt: string;
  appliedAt?: string | null;
}

export type JobCreate = Omit<Job, "id" | "status" | "foundAt" | "appliedAt" | "cvPath" | "coverLetterPath">;
