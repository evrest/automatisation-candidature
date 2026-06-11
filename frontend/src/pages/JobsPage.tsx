import { useCallback, useEffect, useState } from "react";

import { jobsApi } from "../api/jobs";
import { scrapeApi } from "../api/scrape";
import AddJobForm from "../components/jobs/AddJobForm";
import JobCard from "../components/jobs/JobCard";
import ScrapeModal from "../components/jobs/ScrapeModal";
import { RefreshIcon, SearchIcon, TargetIcon } from "../components/icons/Icon";
import PageHeader from "../components/ui/PageHeader";
import type { Job, JobCreate } from "../types/job";
import type { ScrapeRequest } from "../types/scrape";

type Toast = { kind: "success" | "error"; msg: string } | null;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setJobs(await jobsApi.list());
    } catch (e) {
      setToast({ kind: "error", msg: String(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const notify = useCallback((kind: "success" | "error", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleScrape = async (req: ScrapeRequest) => {
    const result = await scrapeApi.run(req);
    const parts = [`${result.created.length} offre(s) importée(s)`];
    if (result.skippedDuplicates > 0) parts.push(`${result.skippedDuplicates} doublon(s) ignoré(s)`);
    notify("success", parts.join(" · "));
    if (result.errors.length > 0) {
      setTimeout(
        () => notify("error", result.errors.map((e) => `${e.site} : ${e.message}`).join(" — ")),
        4200,
      );
    }
    await refresh();
  };

  const handleCreate = async (job: JobCreate) => {
    try {
      await jobsApi.create(job);
      notify("success", "Candidature créée");
      await refresh();
    } catch (e) {
      notify("error", String(e));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await jobsApi.remove(id);
      notify("success", "Candidature supprimée");
      await refresh();
    } catch (e) {
      notify("error", String(e));
    }
  };

  return (
    <>
      <PageHeader
        title="Candidatures"
        description="Les offres scrapées et le suivi de chaque candidature."
        actions={
          <>
            <button className="btn btn-ghost btn-sm" onClick={refresh} disabled={loading}>
              <RefreshIcon size={14} />
              Rafraîchir
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
              <SearchIcon size={14} />
              Scraper les offres
            </button>
          </>
        }
      />

      <AddJobForm onSubmit={handleCreate} />

      {loading ? (
        <div className="card">
          <div className="empty">Chargement…</div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <TargetIcon size={28} />
            </div>
            <div style={{ marginBottom: 4, fontSize: 14, color: "var(--text-soft)" }}>
              Aucune candidature pour l'instant.
            </div>
            <div>Clique sur « Scraper les offres » ou ajoute-en une manuellement.</div>
          </div>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={() => handleDelete(job.id)} />
          ))}
        </div>
      )}

      {modalOpen && <ScrapeModal onClose={() => setModalOpen(false)} onRun={handleScrape} />}
      {toast && <div className={`toast ${toast.kind}`}>{toast.msg}</div>}
    </>
  );
}
