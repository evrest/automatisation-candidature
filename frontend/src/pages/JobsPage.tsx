import { useCallback, useEffect, useState } from "react";

import { jobsApi } from "../api/jobs";
import AddJobForm from "../components/jobs/AddJobForm";
import JobRow from "../components/jobs/JobRow";
import type { Job, JobCreate } from "../types/job";

type Toast = { kind: "success" | "error"; msg: string } | null;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

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

  useEffect(() => { refresh(); }, [refresh]);

  // Helper : exécute une action API, affiche un toast, recharge.
  const run = useCallback(
    async (label: string, fn: () => Promise<unknown>) => {
      try {
        await fn();
        setToast({ kind: "success", msg: `${label} ✓` });
        await refresh();
      } catch (e) {
        setToast({ kind: "error", msg: String(e) });
      } finally {
        setTimeout(() => setToast(null), 2500);
      }
    },
    [refresh],
  );

  const handleCreate = async (job: JobCreate) => {
    await run("Candidature créée", () => jobsApi.create(job));
  };

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Candidatures</h1>
        <div className="toolbar-right actions">
          <button
            className="btn"
            onClick={() => run("Scrape lancé", () => jobsApi.scrape())}
          >
            Scraper LinkedIn / Indeed
          </button>
        </div>
      </div>

      <AddJobForm onSubmit={handleCreate} />

      <section className="section">
        {loading ? (
          <p className="muted">Chargement…</p>
        ) : jobs.length === 0 ? (
          <p className="empty">Aucune candidature pour l'instant.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Poste</th>
                <th>Source</th>
                <th>Lieu</th>
                <th>Statut</th>
                <th>Docs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  actions={[
                    { label: "CV",     run: () => run("CV généré",     () => jobsApi.generateCv(job.id)) },
                    { label: "LM",     run: () => run("LM générée",    () => jobsApi.generateCoverLetter(job.id)) },
                    { label: "Vérifier", run: () => run("Vérifié",     () => jobsApi.verify(job.id)) },
                    { label: "Soumettre", run: () => run("Soumis",     () => jobsApi.submit(job.id)) },
                    { label: "Email",  run: () => run("Email envoyé",  () => jobsApi.sendEmail(job.id)) },
                  ]}
                  onDelete={() => run("Supprimé", () => jobsApi.remove(job.id))}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>

      {toast && <div className={`toast ${toast.kind}`}>{toast.msg}</div>}
    </>
  );
}
