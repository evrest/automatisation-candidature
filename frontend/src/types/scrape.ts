import type { Job } from "./job";

export interface ScrapeSite {
  id: string;
  label: string;
}

export interface ScrapeRequest {
  sites: string[];
  limit: number;
  query?: string;
  location?: string;
}

export interface ScrapeSiteError {
  site: string;
  message: string;
}

export interface ScrapeResult {
  created: Job[];
  skippedDuplicates: number;
  errors: ScrapeSiteError[];
}
