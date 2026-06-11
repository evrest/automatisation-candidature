import { useCallback, useEffect, useState } from "react";

import { jobsApi } from "../api/jobs";
import AddJobForm from "../components/jobs/AddJobForm";
import JobRow, { type JobAction } from "../components/jobs/JobRow";
import { RefreshIcon, SearchIcon, TargetIcon } from "../components/icons/Icon";
import PageHeader from "../components/ui/PageHeader";
import type { Job, JobCreate } from "../types/job";

type Toast = { kind: "success" | "error"; msg: string } | null;

const ACTION_LABELS: Record<JobAction, string> = {
  generateCv: "CV généré",
  generateCoverLetter: "Lettre générée",
  verify: "Documents vérifiés",
  submit: "Candidature soumise",
  sendEmail: "Email envoyé",
  delete: "Candidature supprimée",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const [scraping, setScraping] = useState(false);

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
    setTimeout(() => setToast(null), 2800);
  }, []);

  const run = useCallback(
    async (label: string, fn: () => Promise<unknown>) => {
      try {
        await fn();
        notify("success", label);
        await refresh();
      } catch (e) {
        notify("error", String(e));
      }
    },
    [refresh, notify],
  );

  const handleScrape = async () => {
    setScraping(true);
    try {
      await run("Scrape lancé", () => jobsApi.scrape());
    } finally {
      setScraping(false);
    }
  };

  const handleCreate = async (job: JobCreate) => {
    await run("Candidature créée", () => jobsApi.create(job));
  };

  const handleAction = useCallback(
    (jobId: number, action: JobAction) => {
      const dispatch = (): Promise<unknown> => {
        switch (action) {
          case "generateCv":          return jobsApi.generateCv(jobId);
          case "generateCoverLetter": return jobsApi.generateCoverLetter(jobId);
          case "verify":              return jobsApi.verify(jobId);
          case "submit":              return jobsApi.submit(jobId);
          case "sendEmail":           return jobsApi.sendEmail(jobId);
          case "delete":              return jobsApi.remove(jobId);
        }
      };
      return run(ACTION_LABELS[action], dispatch);
    },
    [run],
  );

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
            <button className="btn btn-primary btn-sm" onClick={handleScrape} disabled={scraping}>
              <SearchIcon size={14} />
              {scraping ? "Scrape en cours…" : "Scraper les offres"}
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
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Poste</th>
                <th>Statut</th>
                <th>Documents</th>
                <th style={{ width: 1, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} onAction={(a) => handleAction(job.id, a)} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className={`toast ${toast.kind}`}>{toast.msg}</div>}
    </>
  );
}
