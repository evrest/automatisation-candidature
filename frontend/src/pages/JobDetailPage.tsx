import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { jobsApi } from "../api/jobs";
import {
  ChevronLeftIcon,
  ExternalLinkIcon,
  FileTextIcon,
  SparklesIcon,
  TrashIcon,
} from "../components/icons/Icon";
import { STATUS_LABEL, type Job, type JobStatus } from "../types/job";

type Toast = { kind: "success" | "error"; msg: string } | null;

/** Vue augmentée d'une candidature : détail scrappé + documents générés. */
export default function JobDetailPage() {
  const { id } = useParams();
  const jobId = Number(id);
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    jobsApi
      .get(jobId)
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [jobId]);

  const notify = useCallback((kind: "success" | "error", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const patch = async (delta: Partial<Job>, okMsg: string) => {
    try {
      setJob(await jobsApi.patch(jobId, delta));
      notify("success", okMsg);
    } catch (e) {
      notify("error", String(e));
    }
  };

  const handleDelete = async () => {
    try {
      await jobsApi.remove(jobId);
      navigate("/jobs");
    } catch (e) {
      notify("error", String(e));
    }
  };

  if (loading) return <p className="muted">Chargement…</p>;
  if (!job) {
    return (
      <div className="card">
        <div className="empty">
          Candidature introuvable. <Link to="/jobs">Retour aux candidatures</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="detail-top">
        <Link to="/jobs" className="btn btn-ghost btn-sm">
          <ChevronLeftIcon size={14} />
          Candidatures
        </Link>
        <button className="btn btn-icon btn-danger" title="Supprimer" onClick={handleDelete}>
          <TrashIcon size={14} />
        </button>
      </div>

      <header className="detail-head card">
        <div className="detail-head-main">
          <h1 className="detail-title">{job.title}</h1>
          <div className="detail-company">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
          </div>
          {job.url && (
            <a href={job.url} target="_blank" rel="noreferrer" className="detail-link">
              Voir l'offre sur {job.source === "manual" ? "le site" : job.source}
              <ExternalLinkIcon size={12} />
            </a>
          )}
        </div>
        <div className="detail-head-side">
          <label className="modal-label" htmlFor="status-select">
            Statut
          </label>
          <select
            id="status-select"
            value={job.status}
            onChange={(e) => patch({ status: e.target.value as JobStatus }, "Statut mis à jour")}
          >
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="detail-meta">
        <Meta label="Contrat" value={job.contractType} />
        <Meta label="Salaire" value={job.salary} />
        <Meta label="Source" value={job.source} />
        <Meta label="Repérée le" value={new Date(job.foundAt).toLocaleDateString("fr-FR")} />
      </div>

      {job.summary && (
        <section className="card detail-section">
          <h2>Résumé IA</h2>
          <p className="detail-summary">{job.summary}</p>
        </section>
      )}

      <section className="card detail-section">
        <h2>Description complète</h2>
        {job.description ? (
          <pre className="detail-description">{job.description}</pre>
        ) : (
          <p className="muted">Pas de description scrappée pour cette offre.</p>
        )}
      </section>

      <DocumentSection
        title="CV"
        icon={<FileTextIcon size={15} />}
        content={job.cvContent}
        generateLabel="Générer le CV"
        onGenerate={async () => setJob(await jobsApi.generateCv(jobId))}
        onSave={(content) => patch({ cvContent: content }, "CV enregistré")}
        notify={notify}
      />

      <DocumentSection
        title="Lettre de motivation"
        icon={<SparklesIcon size={15} />}
        content={job.letterContent}
        generateLabel="Générer la lettre"
        onGenerate={async () => setJob(await jobsApi.generateCoverLetter(jobId))}
        onSave={(content) => patch({ letterContent: content }, "Lettre enregistrée")}
        notify={notify}
      />

      {toast && <div className={`toast ${toast.kind}`}>{toast.msg}</div>}
    </>
  );
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="detail-meta-item">
      <div className="detail-meta-label">{label}</div>
      <div className="detail-meta-value">{value || "—"}</div>
    </div>
  );
}

interface DocProps {
  title: string;
  icon: React.ReactNode;
  content?: string | null;
  generateLabel: string;
  onGenerate: () => Promise<void>;
  onSave: (content: string) => Promise<void>;
  notify: (kind: "success" | "error", msg: string) => void;
}

/** Section document (CV ou lettre) : génération IA + édition manuelle. */
function DocumentSection({ title, icon, content, generateLabel, onGenerate, onSave, notify }: DocProps) {
  const [draft, setDraft] = useState(content ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => setDraft(content ?? ""), [content]);

  const generate = async () => {
    setBusy(true);
    try {
      await onGenerate();
      notify("success", `${title} généré`);
    } catch (e) {
      notify("error", String(e));
    } finally {
      setBusy(false);
    }
  };

  const dirty = draft !== (content ?? "");

  return (
    <section className="card detail-section">
      <div className="detail-doc-head">
        <h2 className="detail-doc-title">
          {icon}
          {title}
        </h2>
        <div className="detail-doc-actions">
          {dirty && (
            <button className="btn btn-ghost btn-sm" onClick={() => onSave(draft)}>
              Enregistrer
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={generate} disabled={busy}>
            {busy ? "Génération…" : generateLabel}
          </button>
        </div>
      </div>
      {content || draft ? (
        <textarea
          className="detail-doc-editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={16}
        />
      ) : (
        <p className="muted">
          Pas encore de {title.toLowerCase()}. Clique sur « {generateLabel} » pour le créer depuis
          ton profil et cette offre.
        </p>
      )}
    </section>
  );
}
