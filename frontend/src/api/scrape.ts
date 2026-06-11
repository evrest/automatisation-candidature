import { api } from "./client";
import type { ScrapeRequest, ScrapeResult, ScrapeSite } from "../types/scrape";

export const scrapeApi = {
  sites: () => api.get<ScrapeSite[]>("/scrape/sites"),
  run: (req: ScrapeRequest) => api.post<ScrapeResult>("/scrape", req),
};
